import { PrismaClient ,UserStatus,Roles,ReportStatus} from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const db = prisma;
export {UserStatus,Roles,ReportStatus}