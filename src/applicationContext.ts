import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { VoucherService } from './vouchers/service/voucher.service';

const applicationContext: Promise<{
  voucherService: VoucherService;
}> = NestFactory.createApplicationContext(AppModule).then((app) => {
  return {
    voucherService: app.select(VouchersModule).get(VoucherService, { strict: true }),
  };
});

export default applicationContext;
