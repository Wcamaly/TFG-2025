-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainerId" TEXT,
    "gymId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "quotaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_quotas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "booking_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_offerts" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "durationInDays" INTEGER NOT NULL,
    "includesBookings" BOOLEAN NOT NULL,
    "bookingQuota" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_offerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offertId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_trainerId_idx" ON "bookings"("trainerId");

-- CreateIndex
CREATE INDEX "bookings_gymId_idx" ON "bookings"("gymId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_quotaId_idx" ON "bookings"("quotaId");

-- CreateIndex
CREATE INDEX "booking_quotas_userId_idx" ON "booking_quotas"("userId");

-- CreateIndex
CREATE INDEX "booking_quotas_paymentId_idx" ON "booking_quotas"("paymentId");

-- CreateIndex
CREATE INDEX "booking_quotas_validFrom_validUntil_idx" ON "booking_quotas"("validFrom", "validUntil");

-- CreateIndex
CREATE INDEX "trainer_offerts_trainerId_idx" ON "trainer_offerts"("trainerId");

-- CreateIndex
CREATE INDEX "trainer_offerts_isActive_idx" ON "trainer_offerts"("isActive");

-- CreateIndex
CREATE INDEX "trainer_subscriptions_userId_idx" ON "trainer_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "trainer_subscriptions_offertId_idx" ON "trainer_subscriptions"("offertId");

-- CreateIndex
CREATE INDEX "trainer_subscriptions_status_idx" ON "trainer_subscriptions"("status");

-- CreateIndex
CREATE INDEX "trainer_subscriptions_paymentId_idx" ON "trainer_subscriptions"("paymentId");

-- CreateIndex
CREATE INDEX "trainer_subscriptions_validUntil_idx" ON "trainer_subscriptions"("validUntil");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_quotas" ADD CONSTRAINT "booking_quotas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_subscriptions" ADD CONSTRAINT "trainer_subscriptions_offertId_fkey" FOREIGN KEY ("offertId") REFERENCES "trainer_offerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
