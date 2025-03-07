import { Router } from "express";

import {
  forgotPassword,
  refresh,
  resendOtp,
  signIn,
  signUp,
  updatePassword,
  verifyOtp,
} from "~/controllers/auth";
import { verifyRequest } from "~/middlewares/auth";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post(
  "/resend-otp",
  verifyRequest({
    types: ["VERIFY", "RESET"],
  }),
  resendOtp,
);

authRouter.post(
  "/verify-otp",
  verifyRequest({
    types: ["VERIFY", "RESET"],
  }),
  verifyOtp,
);

authRouter.post(
  "/update-password",
  verifyRequest({
    types: ["RESET", "ACCESS"],
  }),
  updatePassword,
);

authRouter.post(
  "/refresh",
  verifyRequest({
    types: ["ACCESS"],
    isVerified: true,
  }),
  refresh,
);

export { authRouter };
