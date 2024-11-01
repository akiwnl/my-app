import { NextRequest, NextResponse } from "next/server";
import AuthService from "./modules/services/auth-service";

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

const publicRoutes = ["/", "/portal/login", "/portal/cadastro"];

export async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  if (publicRoutes.includes(pathName)) {
    return NextResponse.next();
  }
  const session = await AuthService.isSessionValid(); // TO DO: validar a sessao do usuario
  if (!session) {
    const isAPIRoute = pathName.startsWith("/api");
    if (isAPIRoute) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }
  return NextResponse.next();
}
