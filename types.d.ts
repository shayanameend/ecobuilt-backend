import type { OtpType, Role } from "@prisma/client";

export type JSON =
  | number
  | string
  | boolean
  | undefined
  | null
  | Date
  | Error
  | Array<JSON>
  | JSONObject;

export interface JSONObject {
  [x: string]: JSON;
}

export interface Info {
  message: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        email: string;
        password: string;
        isVerified: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        profile: {
          id: string;
          name: string;
          phone: string;
          role: $Enums.Role;
          createdAt: Date;
          updatedAt: Date;
        } | null;
      };
    }
    export interface Response {
      success: (body: JSONObject, info: Info) => void;
      created: (body: JSONObject, info: Info) => void;
      badRequest: (body: JSONObject, info: Info) => void;
      unauthorized: (body: JSONObject, info: Info) => void;
      forbidden: (body: JSONObject, info: Info) => void;
      notFound: (body: JSONObject, info: Info) => void;
      internalServerError: (body: JSONObject, info: Info) => void;
    }
  }
}
