import type { OtpType, Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import type { TokenType } from "~/../types";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import {
  BadResponse,
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  handleErrors,
} from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { verifyToken } from "~/utils/jwt";

interface VerifyRequestParams {
  types: TokenType[];
  role?: Role | null;
  isVerified?: boolean | null;
}

function verifyRequest(
  { types, isVerified, role }: Readonly<VerifyRequestParams> = { types: [] },
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const bearerToken = request.headers.authorization;

      if (!bearerToken) {
        throw new UnauthorizedResponse("Unauthorized!");
      }

      const token = bearerToken.split(" ")[1];

      if (!token) {
        throw new UnauthorizedResponse("Unauthorized!");
      }

      const decodedUser = (await verifyToken(token)) as {
        email: string;
        type: OtpType;
      };

      console.log({ token, decodedUser });

      if (types.length > 0 && !types.includes(decodedUser.type as TokenType)) {
        throw new ForbiddenResponse("Forbidden!");
      }

      const user = await prisma.user.findUnique({
        where: {
          email: decodedUser.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          isVerified: true,
          isDeleted: true,
          profile: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundResponse("User Not Found!");
      }

      if (isVerified && !user?.isVerified) {
        throw new BadResponse("User Not Verified!");
      }

      if (role && user?.profile?.role !== role) {
        throw new ForbiddenResponse("Forbidden!");
      }

      request.user = user;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return response.unauthorized(
          {},
          {
            message: "Token Expired!",
          },
        );
      }

      if (error instanceof JsonWebTokenError) {
        return response.unauthorized(
          {},
          {
            message: "Invalid Token!",
          },
        );
      }

      return handleErrors({ response, error });
    }
  };
}

export { verifyRequest };
