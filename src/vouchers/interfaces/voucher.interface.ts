export interface VoucherInterface {
  uuid: string;
  companyUuid: string;
  supplierRuc: string;
  status: string;
  invoiceNumber: string;
  amount: number;
  igv: number;
  total: number;
  issueDate: Date;
  documentType: string;
  createdAt: Date;
}