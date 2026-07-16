export const ADMIN_SESSION_COOKIE = "campus-hazard-admin-session";

const SESSION_PAYLOAD = "admin-authenticated";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signPayload(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(SESSION_PAYLOAD)
  );

  return `${SESSION_PAYLOAD}.${bufferToHex(signature)}`;
}

export async function createAdminSessionToken(
  secret: string
): Promise<string> {
  return signPayload(secret);
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expected = await signPayload(secret);
  return token === expected;
}
