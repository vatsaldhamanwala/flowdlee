import argon2 from 'argon2';

const PASSWORD_CONFIG = {
  type: argon2.argon2id, // Recommended variant.
  memoryCost: 65536, // Uses about 64 MB RAM while hashing. More memory = harder for GPU attacks.
  timeCost: 3, // Three iterations. More iterations = slower hashing. Too high = bad UX. Too low = weaker security. 3 is a good production balance.
  parallelism: 4, // Allows hashing to use multiple CPU threads efficiently.
} as const;

// hash a plain text password
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, PASSWORD_CONFIG);
}

// verify a password against its stored hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
