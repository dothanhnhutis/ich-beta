import { google } from "googleapis";
import nodemailer from "nodemailer";
import env from "@/configs/env";
import Email from "email-templates";
import path from "path";

const oAuth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: env.GOOGLE_REFRESH_TOKEN });

export enum emaiEnum {
  VERIFY_EMAIL = "verifyEmail",
  // SIGNUP = "signup",
  RECOVER_ACCOUNT = "recoverAccount",
  REACTIVATE_ACCOUNT = "reactivateAccount",
  OTP_VERIFY_ACCOUNT = "otpVerifyAccount",
}

type LocalsPayload = {
  [emaiEnum.VERIFY_EMAIL]: {
    username: string;
    verificationLink: string;
  };
  // [emaiEnum.SIGNUP]: {
  //   fullName: string;
  //   verificationLink: string;
  // };
  [emaiEnum.RECOVER_ACCOUNT]: {
    username: string;
    recoverLink: string;
  };
  [emaiEnum.REACTIVATE_ACCOUNT]: {
    username: string;
    reactivateLink: string;
  };
  [emaiEnum.OTP_VERIFY_ACCOUNT]: {
    otp: string;
  };
};

type BuilMap<T extends { [index: string]: any }> = {
  [Key in keyof T]: T[Key] extends object
    ? {
        template: Key;
        receiver: string;
        locals: T[Key];
      }
    : { template: Key };
};

export type SendMailType = BuilMap<LocalsPayload>[keyof LocalsPayload];

export const sendMail = async ({
  template,
  receiver,
  locals,
}: SendMailType) => {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()) as string;
    const smtpTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: env.SENDER_EMAIL,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: env.GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });
    const email: Email = new Email({
      message: {
        from: `I.C.H App <${env.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        applyStyleTags: true,
        // preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "..", "/emails"),
        },
      },
    });
    await email.send({
      template: path.join(__dirname, "..", "/emails", template),
      message: { to: receiver },
      locals: {
        appIcon: env.APP_ICON,
        appLink: env.CLIENT_URL,
        ...locals,
      },
    });
    return true;
  } catch (error: any) {
    console.log(error.message);
    // console.log(error);
    return false;
  }
};
