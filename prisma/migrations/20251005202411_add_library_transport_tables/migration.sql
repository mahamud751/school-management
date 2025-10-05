/*
  Warnings:

  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `borrowings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_transport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."borrowings" DROP CONSTRAINT "borrowings_bookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."borrowings" DROP CONSTRAINT "borrowings_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_transport" DROP CONSTRAINT "student_transport_busId_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_transport" DROP CONSTRAINT "student_transport_studentId_fkey";

-- DropTable
DROP TABLE "public"."books";

-- DropTable
DROP TABLE "public"."borrowings";

-- DropTable
DROP TABLE "public"."buses";

-- DropTable
DROP TABLE "public"."student_transport";
