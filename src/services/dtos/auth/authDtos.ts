// path: src\services\dtos\auth\authDtos.ts
// src/services/dtos/auth/authDtos.ts

import { z } from "zod"
import {forgotPasswordSchema, resetPasswordSchema} from "@/utils/validationSchema"

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>


export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>