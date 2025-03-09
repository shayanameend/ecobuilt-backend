import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  updateCategoryParamsSchema,
} from "~/validators/category";

async function getCategories(request: Request, response: Response) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.success(
      {
        data: { categories },
      },
      {
        message: "Categories fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function createCategory(request: Request, response: Response) {
  try {
    const validatedData = createCategoryBodySchema.parse(request.body);

    const role = request.user.role;

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      validatedData.status = "PENDING";
    }

    const category = await prisma.category.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.success(
      {
        data: { category },
      },
      {
        message: "Category created successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function updateCategory(request: Request, response: Response) {
  try {
    const { id } = updateCategoryParamsSchema.parse(request.params);
    const validatedData = updateCategoryBodySchema.parse(request.body);

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedCategory) {
      throw new NotFoundResponse("Category not found!");
    }

    return response.success(
      {
        data: { category: updatedCategory },
      },
      {
        message: "Category updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function deleteCategory(request: Request, response: Response) {
  try {
    const { id } = updateCategoryParamsSchema.parse(request.params);

    const deletedCategory = await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!deletedCategory) {
      throw new NotFoundResponse("Category not found!");
    }

    return response.success(
      {
        data: { category: deletedCategory },
      },
      {
        message: "Category deleted successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getCategories, createCategory, deleteCategory, updateCategory };
