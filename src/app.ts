import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "~/middlewares/auth";
import { expandResponse } from "~/middlewares/response";
import { authRouter } from "~/routers/auth";
import { profileRouter } from "./routers/profile";

const app = express();

app.use("/subscriptions/webhook", express.raw({ type: "application/json" }));

app.use(
  cors({
    origin: "*",
    maxAge: 7 * 86400, // 7 * 24 hrs
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: Number.POSITIVE_INFINITY }));
app.use(
  express.urlencoded({ extended: true, limit: Number.POSITIVE_INFINITY }),
);
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/test", verifyRequest({ isVerified: true }), (_request, response) => {
  response.success({}, { message: "Test route!" });
});

app.all("*", (_request, response) => {
  response.notFound({}, { message: "Not Found!" });
});

app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    console.error(error);

    response.internalServerError({}, { message: "Internal Server Error!" });
  },
);

export { app };
