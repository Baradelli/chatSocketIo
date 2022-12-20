/*
  Warnings:

  - Added the required column `id_users` to the `chat_room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat_room` ADD COLUMN `id_users` VARCHAR(191) NOT NULL;
