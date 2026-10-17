import { createHash, createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "lujainae_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function configuredCredentials() {
  return Boolean(
    process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET,
  );
}

function passwordMatches(password) {
  const expected = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest();
  const supplied = createHash("sha256").update(password).digest();
  return timingSafeEqual(expected, supplied);
}

function sign(payload) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

function createSession() {
  const payload = `${Date.now() + SESSION_DURATION_SECONDS * 1000}.${randomBytes(16).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

function validSession(token) {
  if (!configuredCredentials() || typeof token !== "string") return false;
  const [expires, nonce, signature, ...extra] = token.split(".");
  if (!expires || !nonce || !signature || extra.length > 0) return false;
  const payload = `${expires}.${nonce}`;
  const expectedSignature = Buffer.from(sign(payload));
  const receivedSignature = Buffer.from(signature);
  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    return false;
  }
  return Number(expires) > Date.now();
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return validSession(cookieStore.get(COOKIE_NAME)?.value);
}

export async function GET() {
  if (!configuredCredentials()) {
    return NextResponse.json(
      { authenticated: false, configured: false },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { authenticated: await isAuthenticated(), configured: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request) {
  if (!configuredCredentials()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body?.password !== "string" ||
    body.password.length > 256 ||
    !passwordMatches(body.password)
  ) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(COOKIE_NAME, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
