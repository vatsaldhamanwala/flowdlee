export interface UserRegisterDTO {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
}

export interface UserLoginDTO {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
}
