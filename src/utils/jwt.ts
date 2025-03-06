import type { OtpType } from "@prisma/client";

import jwt from "jsonwebtoken";

import { env } from "~/lib/env";

async function signToken(payload: {
  email: string;
  type: OtpType;
}) {
  // @ts-ignore
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  });
}

async function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

export { signToken, verifyToken };
