import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createAdminProfileBodySchema,
  createProfileBodySchema,
  createUserProfileBodySchema,
  createVendorProfileBodySchema,
  updateAdminProfileBodySchema,
  updateUserProfileBodySchema,
  updateVendorProfileBodySchema,
} from "~/validators/profile";

async function getProfile(request: Request, response: Response) {
  try {
    const role = request.user.role;

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const profile = await prisma.admin.findUnique({
          where: {
            id: request.user.id,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!profile) {
          throw new NotFoundResponse("Profile not found!");
        }

        return response.success(
          {
            profile,
          },
          {
            message: "Profile fetched successfully!",
          },
        );
      }
      case "VENDOR": {
        const profile = await prisma.vendor.findUnique({
          where: {
            id: request.user.id,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            description: true,
            phone: true,
            postalCode: true,
            city: true,
            pickupAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!profile) {
          throw new NotFoundResponse("Profile not found!");
        }

        return response.success(
          {
            profile,
          },
          {
            message: "Profile fetched successfully!",
          },
        );
      }
      case "USER": {
        const profile = await prisma.user.findUnique({
          where: {
            id: request.user.id,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            postalCode: true,
            city: true,
            deliveryAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!profile) {
          throw new NotFoundResponse("Profile not found!");
        }

        return response.success(
          {
            profile,
          },
          {
            message: "Profile fetched successfully!",
          },
        );
      }
      case "UNSPECIFIED": {
        throw new BadResponse("Invalid Role!");
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createProfile(request: Request, response: Response) {
  try {
    const { role } = createProfileBodySchema.parse(request.body);

    await prisma.auth.update({
      where: {
        id: request.user.id,
      },
      data: {
        role,
      },
    });

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const { name, phone } = createAdminProfileBodySchema.parse(
          request.body,
        );

        const pictureUrl = "";

        const profile = await prisma.admin.create({
          data: {
            pictureUrl,
            name,
            phone,
            auth: {
              connect: {
                id: request.user.id,
              },
            },
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile created successfully!",
          },
        );
      }
      case "VENDOR": {
        const { name, description, phone, postalCode, city, pickupAddress } =
          createVendorProfileBodySchema.parse(request.body);

        const pictureUrl = "";

        const profile = await prisma.vendor.create({
          data: {
            pictureUrl,
            name,
            description,
            phone,
            postalCode,
            city,
            pickupAddress,
            auth: {
              connect: {
                id: request.user.id,
              },
            },
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            description: true,
            phone: true,
            postalCode: true,
            city: true,
            pickupAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile created successfully!",
          },
        );
      }
      case "USER": {
        const { name, phone, postalCode, city, deliveryAddress } =
          createUserProfileBodySchema.parse(request.body);

        const pictureUrl = "";

        const profile = await prisma.user.create({
          data: {
            pictureUrl,
            name,
            phone,
            postalCode,
            city,
            deliveryAddress,
            auth: {
              connect: {
                id: request.user.id,
              },
            },
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            postalCode: true,
            city: true,
            deliveryAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile created successfully!",
          },
        );
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function updateProfile(request: Request, response: Response) {
  try {
    const role = request.user.role;

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const { name, phone } = updateAdminProfileBodySchema.parse(
          request.body,
        );

        const profile = await prisma.admin.update({
          where: {
            id: request.user.id,
          },
          data: {
            name,
            phone,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile updated successfully!",
          },
        );
      }
      case "VENDOR": {
        const { name, description, phone, postalCode, city, pickupAddress } =
          updateVendorProfileBodySchema.parse(request.body);

        const profile = await prisma.vendor.update({
          where: {
            id: request.user.id,
          },
          data: {
            name,
            description,
            phone,
            postalCode,
            city,
            pickupAddress,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            description: true,
            phone: true,
            postalCode: true,
            city: true,
            pickupAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile updated successfully!",
          },
        );
      }
      case "USER": {
        const { name, phone, postalCode, city, deliveryAddress } =
          updateUserProfileBodySchema.parse(request.body);

        const profile = await prisma.user.update({
          where: {
            id: request.user.id,
          },
          data: {
            name,
            phone,
            postalCode,
            city,
            deliveryAddress,
          },
          select: {
            id: true,
            pictureUrl: true,
            name: true,
            phone: true,
            postalCode: true,
            city: true,
            deliveryAddress: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return response.success(
          {
            profile,
          },
          {
            message: "Profile updated successfully!",
          },
        );
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { getProfile, createProfile, updateProfile };
