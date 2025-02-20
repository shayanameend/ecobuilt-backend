import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  updateCategoryParamSchema,
} from "~/validators/categories";

async function getCategories(request: Request, response: Response) {
  try {
    const categories = await prisma.category.findMany({
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
        data: { categories },
      },
      {
        message: "Categories Fetched Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createCategory(request: Request, response: Response) {
  try {
    const { name } = createCategoryBodySchema.parse(request.body);

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return response.success(
      {
        data: { category },
      },
      {
        message: "Category Created Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function updateCategory(request: Request, response: Response) {
  try {
    const { id } = updateCategoryParamSchema.parse(request.params);
    const { name } = updateCategoryBodySchema.parse(request.body);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });

    if (!category) {
      throw new BadResponse("Category Not Found!");
    }

    return response.success(
      {
        data: { category },
      },
      {
        message: "Category Updated Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function deleteCategory(request: Request, response: Response) {
  try {
    const { id } = updateCategoryParamSchema.parse(request.params);

    const category = await prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    if (!category) {
      throw new BadResponse("Category Not Found!");
    }

    return response.success(
      {},
      {
        message: "Category Deleted Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { getCategories, createCategory, updateCategory, deleteCategory };
