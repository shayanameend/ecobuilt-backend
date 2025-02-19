import { Router } from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "~/controllers/profile";
import { verifyRequest } from "~/middlewares/auth";

const profileRouter = Router();

profileRouter.post(
  "/",
  verifyRequest({
    isVerified: true,
  }),
  getProfile,
);

profileRouter.post(
  "/",
  verifyRequest({
    isVerified: true,
  }),
  createProfile,
);

profileRouter.put(
  "/",
  verifyRequest({
    isVerified: true,
  }),
  updateProfile,
);

export { profileRouter };
