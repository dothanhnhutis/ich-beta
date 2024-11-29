import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
