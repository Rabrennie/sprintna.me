-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Choice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "albumId" TEXT NOT NULL,
    "albumImage" TEXT NOT NULL,
    "albumArtist" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "eliminated" BOOLEAN NOT NULL,
    "cssGradient" TEXT,
    "createdAt" INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Choice_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Choice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Choice" ("albumArtist", "albumId", "albumImage", "albumName", "createdAt", "cssGradient", "eliminated", "id", "roomId", "userId") SELECT "albumArtist", "albumId", "albumImage", "albumName", "createdAt", "cssGradient", "eliminated", "id", "roomId", "userId" FROM "Choice";
DROP TABLE "Choice";
ALTER TABLE "new_Choice" RENAME TO "Choice";
CREATE UNIQUE INDEX "Choice_roomId_userId_key" ON "Choice"("roomId", "userId");
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "step" TEXT NOT NULL DEFAULT 'selecting',
    "createdAt" INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    "type" TEXT NOT NULL DEFAULT 'spotify',
    "teamId" INTEGER NOT NULL,
    CONSTRAINT "Room_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("createdAt", "id", "linkId", "name", "step", "teamId") SELECT "createdAt", "id", "linkId", "name", "step", "teamId" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_linkId_key" ON "Room"("linkId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
INSERT INTO "new_User" ("createdAt", "email", "id", "image", "name", "provider", "providerId") SELECT "createdAt", "email", "id", "image", "name", "provider", "providerId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    "invite" TEXT NOT NULL
);
INSERT INTO "new_Team" ("createdAt", "id", "invite", "name") SELECT "createdAt", "id", "invite", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
