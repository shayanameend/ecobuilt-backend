import { Router } from "express";

import {
  getProfile,
  createProfile,
  updateProfile,
} from "~/controllers/profile";
import { verifyRequest } from "~/middlewares/auth";

const profileRouter = Router();

profileRouter.get(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  getProfile,
);

profileRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  createProfile,
);

profileRouter.put(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  updateProfile,
);

export { profileRouter };
