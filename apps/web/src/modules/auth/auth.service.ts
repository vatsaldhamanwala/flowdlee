import { ApiError } from 'next/dist/server/api-utils';
import { UserRepository } from '../users/user.repository';
import { UserLoginInput, UserRegisterInput } from './validators/auth.schema';
import { StatusCodes } from 'http-status-codes';
import { USER } from '@/constants/api-response-error-messages';
import { toUserResponseDTO, UserLoginDTO, UserRegisterDTO } from '../users';
import { hashPassword, verifyPassword } from './auth.password';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  // register new user
  async registerUser(data: UserRegisterInput): Promise<UserRegisterDTO> {
    const userExist = await this.userRepository.findUserByEmail(data.email);

    if (userExist) {
      throw new ApiError(StatusCodes.CONFLICT, USER.EMAIL_ALREADY_EXISTS);
    }

    // hash password
    const passwordHash = await hashPassword(data.password);

    const newUser = await this.userRepository.createUser({
      name: data.name,
      email: data.email,
      passwordHash: passwordHash,
    });
    return toUserResponseDTO(newUser);
  }

  // login user
  async loginUser(data: UserLoginInput): Promise<UserLoginDTO> {
    const userExist = await this.userRepository.findUserByEmail(data.email);

    if (!userExist || !userExist.passwordHash) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, USER.INVALID_CREDENTIALS);
    }

    // verify password
    const isPasswordValid = await verifyPassword(data.password, userExist.passwordHash);

    if (!isPasswordValid) throw new ApiError(StatusCodes.UNAUTHORIZED, USER.INVALID_CREDENTIALS);

    return toUserResponseDTO(userExist);
  }

  //logout user
}
