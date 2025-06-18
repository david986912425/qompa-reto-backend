import { Module } from '@nestjs/common';
import { VoucherService } from './service/voucher.service';

@Module({
  imports: [],
  providers: [VoucherService],
})
export class VouchersModule {}
