import { Voucher } from '@prisma/client';
import { VoucherResponse } from '../dto/voucher-response.dto';

export function toVoucherResponse(voucher: Voucher): VoucherResponse {
  return {
    uuid: voucher.uuid,
    companyUuid: voucher.companyUuid,
    supplierRuc: voucher.supplierRuc,
    status: voucher.status,
    invoiceNumber: voucher.invoiceNumber,
    amount: voucher.amount.toNumber(),
    igv: voucher.igv.toNumber(),
    total: voucher.total.toNumber(),
    issueDate: voucher.issueDate,
    documentType: voucher.documentType,
    createdAt: voucher.createdAt,
  };
}
