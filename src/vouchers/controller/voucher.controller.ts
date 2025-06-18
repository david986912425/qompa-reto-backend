import { api, APIError } from 'encore.dev/api';
import applicationContext from '../../applicationContext';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { toVoucherResponse } from '../mapper/voucher.mapper';
import { VoucherResponse } from '../dto/voucher-response.dto';
import { FindAllVouchersQuery } from '../dto/find-voucher.dto';

export const findAllVouchers = api(
  { expose: true, method: 'GET', path: '/vouchers' },
  async (query: FindAllVouchersQuery): Promise<{ vouchers: VoucherResponse[] }> => {
    const { voucherService } = await applicationContext;

    const filters = {
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    };

    const vouchers = await voucherService.findAll(filters);

    return {
      vouchers: vouchers.map(toVoucherResponse),
    };
  }
);

export const createVouchers = api(
  {
    expose: true,
    method: 'POST',
    path: '/vouchers',
  },
  async (req: CreateVoucherDto): Promise<void> => {
    try {
      const { voucherService } = await applicationContext;
      await voucherService.create(req);
    } catch (error) {
      throw APIError.aborted(error?.toString() || 'Error creating voucher');
    }
  },
);

export const updateStatusVoucher = api(
  {
    expose: true,
    method: 'PATCH',
    path: '/vouchers/:uuid/validate',
  },
  async ({ uuid }: { uuid: string }): Promise<void> => {
    const { voucherService } = await applicationContext;
    await voucherService.validateStatus(uuid);
  },
);

export const exportVouchers = api(
  {
    expose: true,
    method: 'GET',
    path: '/vouchers/export',
  },
  async (query: FindAllVouchersQuery): Promise<{ csvString: string }> => {
    const { voucherService } = await applicationContext;

    const filters = {
      status: query.status,
      documentType: query.documentType,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    };

    const csvString = await voucherService.exportToCSV(filters);
    return { csvString };
  }
);

export const aiQuery = api(
  {
    expose: true,
    method: 'POST',
    path: '/vouchers/ai',
  },
  async (req: { prompt: string  }): Promise<{ answer: string }> => {
    const { prompt } = req;
    const { voucherService } = await applicationContext;

    const answer = await voucherService.handleAIQuery(prompt);
    return { answer };
  }
);