import { SignJWT, jwtVerify } from "jose";

const ISSUER = "lasindu-portfolio";
const AUDIENCE = "portfolio-admin";

export type AdminSession = {
  userId: string;
  username: string;
  version: number;
};

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
};

export const createSessionToken = async (session: AdminSession) =>
  new SignJWT({
    username: session.username,
    version: session.version,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

export const verifySessionToken = async (
  token: string | undefined,
): Promise<AdminSession | null> => {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["HS256"],
    });

    if (
      !payload.sub ||
      typeof payload.username !== "string" ||
      typeof payload.version !== "number"
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      username: payload.username,
      version: payload.version,
    };
  } catch {
    return null;
  }
};
