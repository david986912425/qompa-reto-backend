import { Injectable } from '@nestjs/common';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { VoucherStatus } from '../enum/voucher-status.enum';
import { DocumentType } from '../enum/document-type.enum';
import { Voucher } from '@prisma/client';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class VoucherService {
  async findAll(filters: {
    status?: VoucherStatus;
    documentType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<Voucher[]> {
    const { status, documentType, dateFrom, dateTo, page, limit } = filters;

    return prisma.voucher.findMany({
      where: {
        ...(status && { status }),
        ...(documentType && { documentType }),
        ...(dateFrom || dateTo
          ? {
            issueDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
          : {}),
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: page && limit ? limit : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(input: CreateVoucherDto): Promise<void> {
    const { companyUuid, amount, documentType, supplierRuc } = input;

    const igv = this.calculateIgv(amount);
    const total = amount + igv;

    const invoiceNumber = await this.generateInvoiceNumber(documentType);

    const date = new Date();

    await prisma.voucher.create({
      data: {
        uuid: uuidv4(),
        companyUuid,
        supplierRuc,
        invoiceNumber,
        amount,
        igv,
        total,
        issueDate: date,
        documentType,
        status: VoucherStatus.PENDING,
        createdAt: date,
      },
    });
  }

  async validateStatus(uuid: string): Promise<void> {
    const voucher = await prisma.voucher.findUnique({ where: { uuid } });

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    const statuses = Object.values(VoucherStatus);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.voucher.update({
      where: { uuid },
      data: { status: randomStatus },
    });
  }

  private calculateIgv(amount: number): number {
    return +(amount * 0.18).toFixed(4);
  }

  private async generateInvoiceNumber(documentType: string): Promise<string> {
    const series = documentType === DocumentType.FACTURA ? 'F001' : 'B001';

    const lastVoucher = await prisma.voucher.findFirst({
      where: {
        documentType,
        invoiceNumber: {
          startsWith: series,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    const lastNumber = lastVoucher
      ? parseInt(lastVoucher.invoiceNumber.split('-')[1])
      : 0;

    const nextNumber = (lastNumber + 1).toString().padStart(5, '0');

    return `${series}-${nextNumber}`;
  }

  async exportToCSV(filters: {
    status?: VoucherStatus;
    documentType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<string> {
    const vouchers = await this.findAll(filters);

    if (vouchers.length === 0) {
      return 'No data';
    }

    const rows = vouchers.map(v => ({
      UUID: v.uuid,
      RUC: v.supplierRuc,
      Tipo: v.documentType,
      Monto: v.amount.toString(),
      IGV: v.igv.toString(),
      Total: v.total.toString(),
      Fecha: v.issueDate.toISOString().split('T')[0],
      Estado: v.status,
    }));

    const header = Object.keys(rows[0]).join(',');
    const data = rows.map(row => Object.values(row).join(',')).join('\n');

    return `${header}\n${data}`;
  }

  async handleAIQuery(prompt: string): Promise<string> {
    const vouchers = await prisma.voucher.findMany();

    const summary = this.summarizeVouchers(vouchers);

    const statusOptions = Object.values(VoucherStatus).join(', ');
    const documentTypes = Object.values(DocumentType).join(', ');

    const systemPrompt = `
      Eres un asistente experto en comprobantes. Te daré una lista de comprobantes con los siguientes campos:
      
      - Fecha de emisión (YYYY-MM-DD)
      - Tipo de documento: ${documentTypes}
      - Estado: ${statusOptions}
      - Total del comprobante (S/)
      
      Tu tarea es contar, filtrar o sumar valores según lo que se te pregunte.
      
      Filtra correctamente por mes, tipo de documento y estado. Responde con claridad en español usando únicamente los datos proporcionados.
    `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Estos son los datos:\n${summary}\n\nPregunta: ${prompt}`,
        },
      ],
    });

    return response.choices[0].message.content ?? 'Sin respuesta';
  }

  private summarizeVouchers(vouchers: Voucher[]): string {
    return vouchers
      .map(v => {
        const date = new Date(v.issueDate).toISOString().split('T')[0];
        return `Fecha: ${date}, Tipo: ${v.documentType}, Estado: ${v.status}, Total: S/ ${v.total.toFixed(2)}`;
      })
      .join('\n');
  }
}
