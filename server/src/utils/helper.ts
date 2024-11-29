import crypto from "crypto";
import argon2 from "argon2";
import env from "@/configs/env";
import jwt from "jsonwebtoken";

export const hashData = (data: string) => {
  return argon2.hash(data);
};

export const compareData = (hash: string, input: string): Promise<boolean> => {
  return argon2.verify(hash, input);
};

export async function randId() {
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  return randomBytes.toString("hex");
}

export function generateOTP(props?: { digits?: number } | undefined) {
  if (props && props.digits && props.digits <= 0)
    throw new Error("Digits must be a positive integer");
  return Array.from({ length: props?.digits || 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}

const IV = crypto.randomBytes(16);

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(env.SESSION_SECRET_KEY, "base64"),
    IV
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${IV.toString("hex")}.${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(".");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(env.SESSION_SECRET_KEY, "base64"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function signJWT(
  payload: Object,
  secret: string,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, secret, options);
}

export function verifyJWT<T>(
  token: string,
  secret: string,
  options?: jwt.VerifyOptions
) {
  try {
    const decoded = jwt.verify(token, secret, options) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}
