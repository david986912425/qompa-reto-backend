import { VoucherStatus } from '../enum/voucher-status.enum';

export interface FindAllVouchersQuery {
  status?: VoucherStatus;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}