import { cookies } from "next/headers";

class AuthService {
  private readonly COOKIE_NAME = "admin-auth";
  private readonly LOGGED_IN_VALUE = "true";

  async login(username: string, password: string): Promise<boolean> {
    if (username === "admin" && password === "admin") {
      const c = await cookies();
      const sevenDaysInSeconds = 60 * 60 * 24 * 7;
      c.set(this.COOKIE_NAME, this.LOGGED_IN_VALUE, {
        httpOnly: true,
        secure: true,
        maxAge: sevenDaysInSeconds,
      });
      return true;
    }

    return false;
  }

  async logout(): Promise<void> {
    const c = await cookies();
    c.delete(this.COOKIE_NAME);
  }

  async isLoggedIn(): Promise<boolean> {
    const c = await cookies();
    return c.get(this.COOKIE_NAME)?.value === this.LOGGED_IN_VALUE;
  }
}

const authService = new AuthService();

export default authService;
