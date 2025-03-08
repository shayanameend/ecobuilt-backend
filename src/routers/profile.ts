import { Router } from "express";

import {
  getProfile,
  createProfile,
  updateProfile,
} from "~/controllers/profile";
import { verifyRequest } from "~/middlewares/auth";
import upload from "~/middlewares/upload";

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
  upload.one("picture"),
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
