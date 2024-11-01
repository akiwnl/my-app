import AuthService from "@/modules/services/auth-service";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/portal/login", req.url));

  // Passa o objeto response para o destroySession
  AuthService.destroySession(response);

  return response;
}
