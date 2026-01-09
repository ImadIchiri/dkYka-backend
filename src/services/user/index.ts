import { prisma } from "../../lib/prisma";
import type { NewUser, UpdateUserInput, SafeUser } from "../../types/user";

// Helper to remove password from a user object (or any object contain 'password')
const excludePassword = <T extends { password?: string }>(
  user: T
): Omit<T, "password"> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getAllUsers = async (): Promise<SafeUser[]> => {
  const users = await prisma.user.findMany({
    include: {
      role: true,
      profile: true,
    },
  });

  return users.map((user) => excludePassword(user)) as SafeUser[];
};

export const getUserById = async (userId: string): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      profile: true,
    },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  return excludePassword(user) as SafeUser;
};

export const createUser = async (data: NewUser): Promise<SafeUser> => {
  const newUser = await prisma.user.create({
    data: data as any,
    include: {
      role: true,
      profile: true,
    },
  });

  return excludePassword(newUser) as SafeUser;
};

export const updateUser = async (data: UpdateUserInput): Promise<SafeUser> => {
  const { id, ...updateData } = data;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData as any,
    include: {
      role: true,
      profile: true,
    },
  });

  return excludePassword(updatedUser) as SafeUser;
};

export const deleteUser = async (userId: string): Promise<SafeUser> => {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
    include: {
      role: true,
      profile: true,
    },
  });

  return excludePassword(deletedUser) as SafeUser;
};

export const getUserByEmail = async (
  email: string
): Promise<SafeUser | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      profile: true,
    },
  });

  if (!user) return null;

  return excludePassword(user) as SafeUser;
};
