import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import AuthService from "../services/auth-service";

const prisma = new PrismaClient();

async function createAccount(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(name, email, hashedPassword);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect("/portal/login");
}
async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    console.log("User not found");
    return redirect("/portal/login");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    console.log("Invalid password");
    return redirect("/portal/login");
  }

  await AuthService.createSessionToken({ name: user.name, email: user.email });

  redirect("/portal");
}
const AuthActions = {
  createAccount,
  login,
};

export default AuthActions;
