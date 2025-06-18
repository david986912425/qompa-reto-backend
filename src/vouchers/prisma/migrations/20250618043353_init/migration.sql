-- CreateTable
CREATE TABLE "Company" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "uuid" TEXT NOT NULL,
    "companyUuid" TEXT NOT NULL,
    "supplierRuc" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "documentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_ruc_key" ON "Company"("ruc");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_companyUuid_fkey" FOREIGN KEY ("companyUuid") REFERENCES "Company"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
