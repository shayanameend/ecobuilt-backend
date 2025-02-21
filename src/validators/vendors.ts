import { default as zod } from "zod";

const createVendorBodySchema = zod.object({
  name: zod
    .string({
      message: "Invalid Vendor Name",
    })
    .min(3, {
      message: "Vendor Name must be at least 3 characters long",
    })
    .max(32, {
      message: "Vendor Name must be at most 32 characters long",
    }),
});

const updateVendorParamSchema = zod.object({
  id: zod.string({
    message: "Invalid Vendor ID",
  }),
});

const updateVendorBodySchema = zod.object({
  name: zod
    .string({
      message: "Invalid Vendor Name",
    })
    .min(3, {
      message: "Vendor Name must be at least 3 characters long",
    })
    .max(32, {
      message: "Vendor Name must be at most 32 characters long",
    })
    .optional(),
  isDeleted: zod
    .boolean({
      message: "Invalid isDeleted",
    })
    .optional(),
});

const deleteVendorParamSchema = zod.object({
  id: zod.string({
    message: "Invalid Vendor ID",
  }),
});

export {
  createVendorBodySchema,
  updateVendorParamSchema,
  updateVendorBodySchema,
  deleteVendorParamSchema,
};
