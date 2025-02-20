import { Router } from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "~/controllers/profiles";
import { verifyRequest } from "~/middlewares/auth";

const profileRouter = Router();

profileRouter.get(
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
