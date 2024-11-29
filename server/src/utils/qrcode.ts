import qrcode from "qrcode";

export function generateQRCode(oauthUrl: string) {
  return new Promise<string>((resolve, reject) => {
    qrcode.toDataURL(oauthUrl, async (err, imageUrl) => {
      if (err) reject(err);
      resolve(imageUrl);
    });
  });
}
