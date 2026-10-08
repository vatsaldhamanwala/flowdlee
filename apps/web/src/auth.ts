import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './server/db/prisma';
import { authConfig } from './auth.config';
import { authService, userLoginSchema } from './modules/auth';
import { ApiError } from './server/helpers/api-error';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  ...authConfig,

  providers: [
    Credentials({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        const parsedCredentials = userLoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        try {
          const userExist = await authService.authenticateUser(parsedCredentials.data);

          if (!userExist) {
            return null;
          }

          return {
            id: userExist.id,
            name: userExist.name,
            email: userExist.email,
            image: userExist.avatarUrl,
          };
        } catch (error) {
          if (error instanceof ApiError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
});
