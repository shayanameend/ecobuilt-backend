import type { Request, Response } from "express";

import { handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createProfileSchema,
  updateProfileSchema,
} from "~/validators/profiles";

async function getProfile(request: Request, response: Response) {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: request.user.id,
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
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
        },
      },
    });

    if (!profile) {
      return response.notFound(
        {},
        {
          message: "Profile Not Found!",
        },
      );
    }

    return response.success(
      {
        data: { user: profile?.user },
      },
      {
        message: "Profile Fetched Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createProfile(request: Request, response: Response) {
  try {
    const { firstName, lastName } = createProfileSchema.parse(request.body);

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: request.user.id,
      },
    });

    if (existingProfile) {
      return response.badRequest(
        { data: {} },
        { message: "Profile Already Exists!" },
      );
    }

    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        user: {
          connect: {
            id: request.user.id,
          },
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
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
        },
      },
    });

    return response.created(
      {
        data: { user: profile.user },
      },
      {
        message: "Profile Created Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function updateProfile(request: Request, response: Response) {
  try {
    const { firstName, lastName } = updateProfileSchema.parse(request.body);

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: request.user.id,
      },
    });

    if (!existingProfile) {
      return response.badRequest(
        { data: {} },
        { message: "Profile Not Found!" },
      );
    }

    const profile = await prisma.profile.update({
      where: {
        userId: request.user.id,
      },
      data: {
        firstName,
        lastName,
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
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
        },
      },
    });

    return response.success(
      {
        data: { user: profile.user },
      },
      {
        message: "Profile Updated Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { getProfile, createProfile, updateProfile };
