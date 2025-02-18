import { Router } from "express";

import { verifyRequest } from "~/middlewares/auth";

const authRouter = Router();

// @ts-ignore
authRouter.post("/sign-up", signUp);

// @ts-ignore
authRouter.post("/sign-in", signIn);

// @ts-ignore
authRouter.post("/reset-password", resetPassword);

authRouter.post(
  "/resend-otp",
  verifyRequest({
    isVerified: false,
  }),
  // @ts-ignore
  resendOtp,
);

authRouter.post(
  "/verify-otp",
  verifyRequest({
    isVerified: false,
  }),
  // @ts-ignore
  verifyOtp,
);

authRouter.post(
  "/update-password",
  verifyRequest({
    isVerified: true,
  }),
  // @ts-ignore
  updatePassword,
);

authRouter.post(
  "/refresh",
  verifyRequest({
    isVerified: true,
  }),
  // @ts-ignore
  refresh,
);

export { authRouter };
