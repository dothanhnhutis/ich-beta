import otpauth from "otpauth";

export type TOTPAuth = {
  ascii: string;
  hex: string;
  base32: string;
  oauth_url: string;
};

export function generateMFA(label: string): TOTPAuth {
  const secret = new otpauth.Secret({ size: 20 });
  const totp = new otpauth.TOTP({
    issuer: "I.C.H Web Service",
    label: label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });
  return {
    ascii: secret.latin1,
    hex: secret.hex,
    base32: secret.base32,
    oauth_url: totp.toString(),
  };
}

export function generateOTPMFA(secretKey: string) {
  const totp = new otpauth.TOTP({
    issuer: "I.C.H Web Service",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: otpauth.Secret.fromBase32(secretKey),
  });
  return totp.generate();
}

export function validateMFA({
  secret,
  token,
}: {
  secret: string;
  token: string;
}) {
  const totp = new otpauth.TOTP({
    secret,
  });
  return totp.validate({ token });
}
