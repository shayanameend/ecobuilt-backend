import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createVendorBodySchema,
  updateVendorBodySchema,
  updateVendorParamSchema,
} from "~/validators/vendors";

async function getVendors(request: Request, response: Response) {
    try {
      const vendors = await prisma.vendor.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      return response.success(
        {
          data: { vendors },
        },
        {
          message: "Vendors Fetched Successfully!",
        },
      );
    } catch (error) {
      return handleErrors({ response, error });
    }
  }
  
  async function createVendor(request: Request, response: Response) {
    try {
      const { name } = createVendorBodySchema.parse(request.body);
  
      const vendor = await prisma.vendor.create({
        data: {
          name,
        },
      });
  
      return response.success(
        {
          data: { vendor },
        },
        {
          message: "Vendor Created Successfully!",
        },
      );
    } catch (error) {
      return handleErrors({ response, error });
    }
  }
  
  async function updateVendor(request: Request, response: Response) {
    try {
      const { id } = updateVendorParamSchema.parse(request.params);
      const { name } = updateVendorBodySchema.parse(request.body);
  
      const vendor = await prisma.vendor.update({
        where: { id },
        data: {
          name,
        },
      });
  
      if (!vendor) {
        throw new BadResponse("Vendor Not Found!");
      }
  
      return response.success(
        {
          data: { vendor },
        },
        {
          message: "Vendor Updated Successfully!",
        },
      );
    } catch (error) {
      return handleErrors({ response, error });
    }
  }
  
  async function deleteVendor(request: Request, response: Response) {
    try {
      const { id } = updateVendorParamSchema.parse(request.params);
  
      const vendor = await prisma.vendor.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
  
      if (!vendor) {
        throw new BadResponse("Vendor Not Found!");
      }
  
      return response.success(
        {},
        {
          message: "Vendor Deleted Successfully!",
        },
      );
    } catch (error) {
      return handleErrors({ response, error });
    }
  }
  
  export { getVendors, createVendor, updateVendor, deleteVendor };
  