import * as jose from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

async function createSessionToken(payload = {}) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  const { exp } = await openSessionToken(session);
  (await cookies()).set("session", session, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: true,
  });
}

async function isSessionValid() {
  const sessionCookie = (await cookies()).get("session");
  if (sessionCookie) {
    const { value } = sessionCookie;
    const { exp } = await openSessionToken(value);
    const currentDate = new Date().getTime();

    return (exp as number) * 1000 > currentDate;
  }
}

async function destroySession(response: NextResponse): Promise<void> {
  response.cookies.set("session", "", { path: "/", maxAge: 0 });
}

const AuthService = {
  openSessionToken,
  createSessionToken,
  isSessionValid,
  destroySession,
};

export default AuthService;
