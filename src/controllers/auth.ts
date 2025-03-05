import type { Request, Response } from "express";

import { OtpType } from "@prisma/client";
import { default as argon } from "argon2";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { sendOTP } from "~/services/mail";
import { signToken } from "~/utils/jwt";
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  verifyOtpSchema,
} from "~/validators/auth";

async function signUp(request: Request, response: Response) {
  try {
    if (request.body.emai) {
      request.body.email = request.body.email.toLowerCase();
    }

    const { email, password } = signUpSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadResponse("User Already Exists!");
    }

    const hashedPassword = await argon.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
    }

    const otp = await prisma.otp.upsert({
      where: {
        userId: user.id,
      },
      update: {
        code,
        type: OtpType.VERIFY_EMAIL,
      },
      create: {
        code,
        type: OtpType.VERIFY_EMAIL,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await sendOTP({
      to: user.email,
      code: otp.code,
    });

    const token = await signToken({
      email: user.email,
    });

    return response.created(
      {
        data: { token },
      },
      {
        message: "Sign Up Successfull!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function signIn(request: Request, response: Response) {
  try {
    request.body.email = request.body.email.toLowerCase();

    const { email, password } = signInSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundResponse("User Not Found!");
    }

    const isPasswordValid = await argon.verify(user.password, password);

    if (!isPasswordValid) {
      throw new BadResponse("Invalid Password!");
    }

    const token = await signToken({
      email: user.email,
    });

    if (!user.isVerified) {
      const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      let code = "";

      for (let i = 0; i < 6; i++) {
        code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
      }

      const otp = await prisma.otp.upsert({
        where: {
          userId: user.id,
        },
        update: {
          code,
          type: OtpType.VERIFY_EMAIL,
        },
        create: {
          code,
          type: OtpType.VERIFY_EMAIL,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await sendOTP({
        to: user.email,
        code: otp.code,
      });

      return response.success(
        {
          data: { token },
        },
        {
          message: "OTP Sent Successfully!",
        },
      );
    }

    return response.success(
      {
        data: { token },
      },
      {
        message: "Sign In Successfull!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function resetPassword(request: Request, response: Response) {
  try {
    request.body.email = request.body.email.toLowerCase();

    const { email } = resetPasswordSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundResponse("User Not Found!");
    }

    const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
    }

    const otp = await prisma.otp.upsert({
      where: {
        userId: user.id,
      },
      update: {
        code,
        type: OtpType.VERIFY_EMAIL,
      },
      create: {
        code,
        type: OtpType.VERIFY_EMAIL,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await sendOTP({
      to: user.email,
      code: otp.code,
    });

    const token = await signToken({
      email: user.email,
    });

    return response.success(
      {
        data: { token },
      },
      {
        message: "OTP Sent Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function resendOtp(request: Request, response: Response) {
  try {
    const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
    }

    const otp = await prisma.otp.upsert({
      where: {
        userId: request.user.id,
      },
      update: {
        code,
        type: OtpType.VERIFY_EMAIL,
      },
      create: {
        code,
        type: OtpType.VERIFY_EMAIL,
        user: {
          connect: {
            id: request.user.id,
          },
        },
      },
    });

    await sendOTP({
      to: request.user.email,
      code: otp.code,
    });

    return response.success(
      {},
      {
        message: "OTP Sent Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function verifyOtp(request: Request, response: Response) {
  try {
    const { otp, type } = verifyOtpSchema.parse(request.body);

    const existingOtp = await prisma.otp.findUnique({
      where: {
        userId: request.user.id,
        type,
      },
    });

    if (!existingOtp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (existingOtp.code !== otp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (type === OtpType.VERIFY_EMAIL) {
      await prisma.user.update({
        where: { id: request.user.id },
        data: { isVerified: true },
      });
    }

    await prisma.otp.delete({
      where: {
        userId: request.user.id,
        type,
      },
    });

    const token = await signToken({
      email: request.user.email,
    });

    return response.success(
      {
        data: { token },
      },
      {
        message: "OTP Verified Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function updatePassword(request: Request, response: Response) {
  try {
    const { password } = updatePasswordSchema.parse(request.body);

    const hashedPassword = await argon.hash(password);

    await prisma.user.update({
      where: { id: request.user.id },
      data: { password: hashedPassword },
    });

    return response.success(
      {
        data: {},
      },
      {
        message: "Password Updated Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function refresh(request: Request, response: Response) {
  try {
    const token = await signToken({
      email: request.user.email,
    });

    // @ts-ignore
    request.user.password = undefined;

    return response.success(
      {
        data: {
          user: request.user,
          token,
        },
      },
      {
        message: "Token Refreshed Successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export {
  signUp,
  signIn,
  resetPassword,
  resendOtp,
  verifyOtp,
  updatePassword,
  refresh,
};
