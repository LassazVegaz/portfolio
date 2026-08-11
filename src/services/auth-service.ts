import "server-only";

import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma-service";
import {
  COOKIE_NAME_ADMIN_SESSION,
  sessionCookieOptions,
} from "@/constants/cookies.constants";
import {
  AdminSession,
  createSessionToken,
  verifySessionToken,
} from "./session-service";

const PASSWORD_ROUNDS = 12;

export class AuthenticationError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

class AuthService {
  async login(usernameInput: string, password: string): Promise<boolean> {
    const username = usernameInput.trim();
    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user) return false;

    const passwordMatches = await compare(password, user.passwordHash);
    if (!passwordMatches) return false;

    await this.writeSession({
      userId: user.id,
      username: user.username,
      version: user.sessionVersion,
    });
    return true;
  }

  async logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME_ADMIN_SESSION);
  }

  async getSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies();
    return verifySessionToken(
      cookieStore.get(COOKIE_NAME_ADMIN_SESSION)?.value,
    );
  }

  async getAuthenticatedUser() {
    const session = await this.getSession();
    if (!session) return null;

    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });
    if (user?.sessionVersion !== session.version) return null;
    return user;
  }

  async requireAuthenticatedUser() {
    const user = await this.getAuthenticatedUser();
    if (!user) throw new AuthenticationError();
    return user;
  }

  async isLoggedIn(): Promise<boolean> {
    return (await this.getAuthenticatedUser()) !== null;
  }

  async updateProfile(input: {
    username: string;
    currentPassword: string;
    newPassword?: string;
  }) {
    const user = await this.requireAuthenticatedUser();
    if (!(await compare(input.currentPassword, user.passwordHash))) {
      throw new AuthenticationError("The current password is incorrect.");
    }

    const username = input.username.trim();
    const passwordHash = input.newPassword
      ? await hash(input.newPassword, PASSWORD_ROUNDS)
      : user.passwordHash;

    const updated = await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        username,
        passwordHash,
        sessionVersion: { increment: 1 },
      },
    });

    await this.writeSession({
      userId: updated.id,
      username: updated.username,
      version: updated.sessionVersion,
    });
    return updated;
  }

  private async writeSession(session: AdminSession) {
    const cookieStore = await cookies();
    cookieStore.set(
      COOKIE_NAME_ADMIN_SESSION,
      await createSessionToken(session),
      sessionCookieOptions,
    );
  }
}

const authService = new AuthService();
export default authService;
