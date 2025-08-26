-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SISWA', 'GURU', 'ORANGTUA');

-- CreateTable
CREATE TABLE "public"."Akun" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'SISWA',
    "point" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "lastUpdateById" TEXT,

    CONSTRAINT "Akun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Akun_username_key" ON "public"."Akun"("username");

-- AddForeignKey
ALTER TABLE "public"."Akun" ADD CONSTRAINT "Akun_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Akun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Akun" ADD CONSTRAINT "Akun_lastUpdateById_fkey" FOREIGN KEY ("lastUpdateById") REFERENCES "public"."Akun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
