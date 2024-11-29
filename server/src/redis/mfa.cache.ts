import { redisClient } from "@/redis/connection";
import { MFA } from "@/services/mfa";
import { generateMFA, TOTPAuth } from "@/utils/mfa";

export const readSetupMFA = async (userId: string) => {
  try {
    const existMFASetup = await redisClient.get(`mfas:${userId}:setup`);
    if (!existMFASetup) return;
    return JSON.parse(existMFASetup) as TOTPAuth;
  } catch (error) {
    console.log(`readSetupMFA() method error: `, error);
  }
};

export async function readMFACache(userId: string) {
  try {
    const data = await redisClient.get(`mfas:${userId}`);
    if (!data) return;
    return JSON.parse(data) as MFA;
  } catch (error: unknown) {
    console.log(`readMFACache() method error: `, error);
  }
}

export async function readMFASessionCache(sessionId: string) {
  try {
    const sessionCache = await redisClient.get(`mfas:sessions:${sessionId}`);
    if (!sessionCache) return;
    return JSON.parse(sessionCache) as {
      userId: string;
      secretKey: string;
    };
  } catch (error: unknown) {
    console.log(`readMFASessionCache() method error: `, error);
  }
}

export const writeSetupMFA = async (userId: string, deviceName: string) => {
  try {
    const existMFASetup = await redisClient.get(`mfas:${userId}:setup`);
    if (existMFASetup) {
      return JSON.parse(existMFASetup) as TOTPAuth;
    } else {
      const totp = generateMFA(deviceName);
      await redisClient.set(
        `mfas:${userId}:setup`,
        JSON.stringify(totp),
        "EX",
        30 * 60
      );
      return totp;
    }
  } catch (error: unknown) {
    console.log(`writeSetupMFA() method error: `, error);
  }
};

export async function writeMFACache(input: MFA) {
  try {
    await redisClient.set(`mfas:${input.userId}`, JSON.stringify(input));
  } catch (error: unknown) {
    console.log(`writeMFACache() method error: `, error);
  }
}

export async function writeMFASessionCache(
  sessionId: string,
  input: {
    userId: string;
    secretKey: string;
  }
) {
  try {
    await redisClient.set(
      `mfas:sessions:${sessionId}`,
      JSON.stringify(input),
      "EX",
      30 * 60 * 1000
    );
  } catch (error: unknown) {
    console.log(`writeMFASessionCache() method error: `, error);
  }
}

export const removeSetupMFA = async (userId: string) => {
  try {
    await redisClient.del(`mfas:${userId}:setup`);
  } catch (error) {
    console.log(`removeSetupMFA() method error: `, error);
  }
};

export async function removeMFACache(userId: string) {
  try {
    await redisClient.del(`mfas:${userId}`);
  } catch (error: unknown) {
    console.log(`removeMFACache() method error: `, error);
  }
}

export async function removeMFASessionCache(sessionId: string) {
  try {
    await redisClient.del(`mfas:sessions:${sessionId}`);
  } catch (error: unknown) {
    console.log(`removeMFASessionCache() method error: `, error);
  }
}
