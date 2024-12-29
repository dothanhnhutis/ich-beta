import jwt from "jsonwebtoken";

export function signJWT(
  payload: { [index: string]: string },
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
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}
