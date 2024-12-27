import { redisClient } from "@/redis/connection";
import { User, UserToken } from "@/schemas/user";
import { generateOTP, hashData } from "@/utils/helper";

export async function readUserCacheByEmail(email: string) {
  try {
    const id = await redisClient.get(`users:email:${email}`);
    if (!id) return;
    const user = await redisClient.get(`users:${id}`);
    if (!user) return;
    return JSON.parse(user) as User;
  } catch (error: unknown) {
    console.log(`readUserCacheByEmail() method error: `, error);
  }
}

export async function readUserCacheById(id: string) {
  try {
    const user = await redisClient.get(`users:${id}`);
    return user == null ? null : (JSON.parse(user) as User);
  } catch (error: unknown) {
    console.log(`readUserCacheById() method error: `, error);
    return null;
  }
}

export async function readUserTokenCache(token: UserToken) {
  let userId: string | null = null;
  switch (token.type) {
    case "emailVerification":
      userId = await redisClient.get(
        `users:emailVerification:${token.session}`
      );
      break;
    case "recover":
      userId = await redisClient.get(`users:recover:${token.session}`);
      break;
    case "reActivate":
      userId = await redisClient.get(`users:reActivate:${token.session}`);
      break;
  }

  if (!userId) return;
  const user = await redisClient.get(`users:${userId}`);
  return user ? (JSON.parse(user) as User) : undefined;
}

export async function readChangeEmailSessionCache(sessionId: string) {
  try {
    const sessionCache = await redisClient.get(
      `users:change-email:${sessionId}`
    );
    if (!sessionCache) return;
    return JSON.parse(sessionCache) as {
      userId: string;
      newEmail: string;
      otp: string;
    };
  } catch (error: unknown) {
    console.log(`readChangeEmailSessionCache() method error: `, error);
  }
}

export async function writeUserCache(user: User) {
  try {
    await redisClient.set(`users:${user.id}`, JSON.stringify(user));
    await redisClient.set(`users:email:${user.email}`, user.id);
  } catch (error: unknown) {
    console.log(`writeUserCacheByKey() method error: `, error);
  }
}

export async function writeUserTokenCache(
  token: UserToken & { userId: string; expires: Date }
) {
  try {
    let userId: string | null = null;
    switch (token.type) {
      case "emailVerification":
        userId = await redisClient.set(
          `users:emailVerification:${token.session}`,
          token.userId,
          "PX",
          token.expires.getTime() - Date.now()
        );
        break;
      case "recover":
        userId = await redisClient.set(
          `users:recover:${token.session}`,
          token.userId,
          "PX",
          token.expires.getTime() - Date.now()
        );
        break;
      case "reActivate":
        userId = await redisClient.set(
          `users:reActivate:${token.session}`,
          token.userId,
          "PX",
          token.expires.getTime() - Date.now()
        );
        break;
    }

    if (!userId) return;
    const user = await redisClient.get(`users:${userId}`);
    return user ? (JSON.parse(user) as User) : undefined;
  } catch (error: unknown) {
    console.log(`writeUserTokenCache() method error: `, error);
  }
}

export async function writeChangeEmailSessionCache(
  sessionId: string,
  input: { userId: string; newEmail: string; otp: string }
) {
  try {
    await redisClient.set(
      `users:change-email:${sessionId}`,
      JSON.stringify({
        ...input,
        otp: await hashData(input.otp),
      }),
      "EX",
      4 * 60 * 60
    );
  } catch (error: unknown) {
    console.log(`writeChangeEmailSessionCache() method error: `, error);
  }
}

export async function removeUserTokenCache(token: UserToken) {
  try {
    switch (token.type) {
      case "emailVerification":
        await redisClient.del(`users:emailVerification:${token.session}`);
        break;
      case "recover":
        await redisClient.del(`users:recover:${token.session}`);
        break;
      case "reActivate":
        await redisClient.del(`users:reActivate:${token.session}`);
        break;
    }
  } catch (error: unknown) {
    console.log(`removeUserTokenCache() method error: `, error);
  }
}

export async function removeChangeEmailSessionCache(sessionId: string) {
  try {
    await redisClient.del(`users:change-email:${sessionId}`);
  } catch (error: unknown) {
    console.log(`removeChangeEmailSessionCache() method error: `, error);
  }
}

export async function removeEmailCache(email: string) {
  try {
    await redisClient.del(`users:email:${email}`);
  } catch (error: unknown) {
    console.log(`removeEmailCache() method error: `, error);
  }
}
