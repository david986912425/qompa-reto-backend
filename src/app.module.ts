import { Module } from '@nestjs/common';
import { VouchersModule } from './vouchers/vouchers.module';

@Module({
  imports: [ VouchersModule],
})
export class AppModule {}
