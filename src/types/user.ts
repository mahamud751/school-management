import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: Role;
  }

  interface Session {
    user: User;
  }
}
