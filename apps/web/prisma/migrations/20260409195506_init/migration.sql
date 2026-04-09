-- CreateTable
CREATE TABLE "CompanionDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL,
    "personalityTemplate" TEXT NOT NULL,
    "avatarTheme" TEXT NOT NULL,
    "skillPacksJson" TEXT NOT NULL,
    "savedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LessonResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonPackId" TEXT NOT NULL,
    "companionDraftId" TEXT,
    "companionName" TEXT NOT NULL,
    "attemptedAt" DATETIME NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "checksJson" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonResult_companionDraftId_fkey" FOREIGN KEY ("companionDraftId") REFERENCES "CompanionDraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companionDraftId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatSession_companionDraftId_fkey" FOREIGN KEY ("companionDraftId") REFERENCES "CompanionDraft" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "sequence" INTEGER NOT NULL,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LessonResult_companionDraftId_attemptedAt_idx" ON "LessonResult"("companionDraftId", "attemptedAt");

-- CreateIndex
CREATE INDEX "ChatSession_companionDraftId_updatedAt_idx" ON "ChatSession"("companionDraftId", "updatedAt");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_sequence_idx" ON "ChatMessage"("sessionId", "sequence");
