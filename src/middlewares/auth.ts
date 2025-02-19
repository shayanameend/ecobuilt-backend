import type { Role, User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

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
  role?: Role;
  isVerified?: boolean;
}

function verifyRequest({ role, isVerified }: Readonly<VerifyRequestParams>) {
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

      const decodedUser = (await verifyToken(token)) as User;

      if (role && decodedUser.role !== role) {
        throw new ForbiddenResponse("Forbidden!");
      }

      if (isVerified && !decodedUser.isVerified) {
        throw new BadResponse("User Not Verified!");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decodedUser.id,
        },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          isVerified: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundResponse("User Not Found!");
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
