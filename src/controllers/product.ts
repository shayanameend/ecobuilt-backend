import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
  updateCategoryParamsSchema,
} from "~/validators/category";

async function getProducts(request: Request, response: Response) {}

async function getProduct(request: Request, response: Response) {}

async function createProduct(request: Request, response: Response) {}

async function updateProduct(request: Request, response: Response) {}

export { getProducts, getProduct, createProduct, updateProduct };
