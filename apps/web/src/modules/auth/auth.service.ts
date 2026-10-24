import { ApiError } from '@/server/helpers/api-error';
import { UserRepository } from '../users/user.repository';
import { UserLoginInput, UserRegisterInput } from './validators/auth.schema';
import { StatusCodes } from 'http-status-codes';
import { TOKEN, USER } from '@/constants/api-response-error-messages';
import { toUserResponseDTO, UserResponseDTO } from '../users';
import { hashPassword, verifyPassword } from './auth.password';
import { Prisma } from '@/generated/prisma';
import { generateRefreshToken, hashToken, signAccessToken } from './auth.token';
import { AuthRepository } from './auth.repository';
import { AUTH } from '@/constants/auth.constants';

// A real argon2 hash to verify against when the email doesn't exist.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword('not-a-real-password'));
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  // register new user
  async registerUser(data: UserRegisterInput): Promise<UserResponseDTO> {
    const userExist = await this.userRepository.findUserByEmail(data.email);

    if (userExist) {
      throw new ApiError(StatusCodes.CONFLICT, USER.EMAIL_ALREADY_EXISTS);
    }

    // hash password
    const passwordHash = await hashPassword(data.password);

    try {
      const newUser = await this.userRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash: passwordHash,
      });

      return toUserResponseDTO(newUser);
    } catch (error) {
      // Two simultaneous requests can both pass the check above;
      // the DB's unique constraint is the real guard.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ApiError(StatusCodes.CONFLICT, USER.EMAIL_ALREADY_EXISTS);
      }

      throw error;
    }
  }

  // issue token
  private async issueTokens(userId: string) {
    // generate access token
    const accessToken = await signAccessToken(userId);
    // generate refresh token
    const refreshToken = generateRefreshToken();

    // create refresh token
    await this.authRepository.createRefreshToken({
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + AUTH.COOKIE_MAX_AGE.REFRESH_TOKEN * 1000),
    });

    return { accessToken, refreshToken };
  }

  // authenticate user
  async authenticate(email: string, password: string) {
    const userExist = await this.userRepository.findUserByEmail(email);

    // Always run one argon2 verify, so response time doesn't reveal whether the email exists.
    const hash = userExist?.passwordHash ?? (await getDummyHash());
    const isPasswordValid = await verifyPassword(hash, password);

    if (!userExist || !isPasswordValid) throw new ApiError(StatusCodes.UNAUTHORIZED, USER.INVALID_CREDENTIALS);

    return userExist;
  }

  // login user
  async loginUser(data: UserLoginInput) {
    const userExist = await this.authenticate(data.email, data.password);

    const token = await this.issueTokens(userExist.id);

    return { user: toUserResponseDTO(userExist), ...token };
  }

  private unauthorized() {
    return new ApiError(StatusCodes.UNAUTHORIZED, TOKEN.INVALID_REFRESH_TOKEN);
  }

  // refresh session
  async refreshSession(rawRefreshToken: string) {
    // find refresh token by hash
    const hashRefreshTokenExist = await this.authRepository.findRefreshTokenByHash(hashToken(rawRefreshToken));

    // if not throw error
    if (!hashRefreshTokenExist) throw this.unauthorized();

    // check already used or revoked refresh token
    if (hashRefreshTokenExist.revokedAt) {
      await this.authRepository.revokeAllUserTokens(hashRefreshTokenExist.id);

      throw this.unauthorized();
    }

    // check if the token expired date is surpassed or old
    if (hashRefreshTokenExist.expiresAt <= new Date()) throw this.unauthorized();

    // find the rotation of outcome -> only one request can win
    const wasRefreshTokenRevoked = await this.authRepository.revokeRefreshToken(hashRefreshTokenExist.id);

    // if not won -> throw error
    if (!wasRefreshTokenRevoked) {
      await this.authRepository.revokeAllUserTokens(hashRefreshTokenExist.userId);

      throw this.unauthorized();
    }

    // if the request made and was revoked refresh token successfully with one request than issue the new token to user
    return this.issueTokens(hashRefreshTokenExist.userId);
  }

  // get current user
  async getCurrentUser(userId: string) {
    const userExist = await this.userRepository.findUserById(userId);

    // token was valid but the account no longer exists
    if (!userExist) throw new ApiError(StatusCodes.UNAUTHORIZED, USER.UNAUTHORIZED);

    return toUserResponseDTO(userExist);
  }

  //logout user
  async logoutUser(rawRefreshToken?: string) {
    // check if rawRefreshToken is there -> if yes than return and log out the user directly
    if (!rawRefreshToken) return;

    // find refresh token by hash
    const hashRefreshTokenExist = await this.authRepository.findRefreshTokenByHash(hashToken(rawRefreshToken));

    // if refresh token by hash found and it is not revoked than -> revoked refresh token
    if (hashRefreshTokenExist && !hashRefreshTokenExist.revokedAt) {
      await this.authRepository.revokeRefreshToken(hashRefreshTokenExist.id);
    }
  }
}
