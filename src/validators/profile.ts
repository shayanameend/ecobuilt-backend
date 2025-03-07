import { Role } from "@prisma/client";

import * as zod from "zod";

const createProfileBodySchema = zod.object({
  role: zod.enum([Role.SUPER_ADMIN, Role.ADMIN, Role.VENDOR, Role.USER], {
    message: "Invalid Role!",
  }),
});

const createAdminProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
});

const createVendorProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  description: zod
    .string({
      message: "Description is required!",
    })
    .min(10, {
      message: "Description is too short!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
  postalCode: zod
    .string({
      message: "Postal Code is required!",
    })
    .length(6, {
      message: "Postal Code is invalid!",
    }),
  city: zod
    .string({
      message: "City is required!",
    })
    .min(3, {
      message: "City is too short!",
    }),
  pickupAddress: zod
    .string({
      message: "Pickup Address is required!",
    })
    .min(10, {
      message: "Pickup Address is too short!",
    }),
});

const createUserProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
  postalCode: zod
    .string({
      message: "Postal Code is required!",
    })
    .length(6, {
      message: "Postal Code is invalid!",
    }),
  city: zod
    .string({
      message: "City is required!",
    })
    .min(3, {
      message: "City is too short!",
    }),
  deliveryAddress: zod
    .string({
      message: "Delivery Address is required!",
    })
    .min(10, {
      message: "Delivery Address is too short!",
    }),
});

const updateAdminProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
});

const updateVendorProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  description: zod
    .string({
      message: "Description is required!",
    })
    .min(10, {
      message: "Description is too short!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
  postalCode: zod
    .string({
      message: "Postal Code is required!",
    })
    .length(6, {
      message: "Postal Code is invalid!",
    }),
  city: zod
    .string({
      message: "City is required!",
    })
    .min(3, {
      message: "City is too short!",
    }),
  pickupAddress: zod
    .string({
      message: "Pickup Address is required!",
    })
    .min(10, {
      message: "Pickup Address is too short!",
    }),
});

const updateUserProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name is required!",
    })
    .min(3, {
      message: "Name is too short!",
    })
    .max(32, {
      message: "Name is too long!",
    }),
  phone: zod
    .string({
      message: "Phone is required!",
    })
    .min(10, {
      message: "Phone is too short!",
    }),
  postalCode: zod
    .string({
      message: "Postal Code is required!",
    })
    .length(6, {
      message: "Postal Code is invalid!",
    }),
  city: zod
    .string({
      message: "City is required!",
    })
    .min(3, {
      message: "City is too short!",
    }),
  deliveryAddress: zod
    .string({
      message: "Delivery Address is required!",
    })
    .min(10, {
      message: "Delivery Address is too short!",
    }),
});

export {
  createProfileBodySchema,
  createAdminProfileBodySchema,
  createVendorProfileBodySchema,
  createUserProfileBodySchema,
  updateAdminProfileBodySchema,
  updateVendorProfileBodySchema,
  updateUserProfileBodySchema,
};
