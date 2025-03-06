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

authRouter.post("/resend-otp", verifyRequest(), resendOtp);

authRouter.post("/verify-otp", verifyRequest(), verifyOtp);

authRouter.post(
  "/update-password",
  verifyRequest({
    type: "RESET_PASSWORD",
  }),
  updatePassword,
);

authRouter.post(
  "/refresh",
  verifyRequest({
    type: "VERIFY_EMAIL",
    isVerified: true,
  }),
  refresh,
);

export { authRouter };
