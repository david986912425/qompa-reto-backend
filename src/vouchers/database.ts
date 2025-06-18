import { SQLDatabase } from "encore.dev/storage/sqldb";
import { PrismaClient } from "@prisma/client";

const DB = new SQLDatabase("appDB", {
  migrations: {
    path: "./prisma/migrations",
    source: "prisma",
  },
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DB.connectionString,
    },
  },
});

export { prisma };