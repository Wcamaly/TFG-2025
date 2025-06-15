import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandlePaymentWebhookDto {
  @ApiProperty({ description: 'ID del pago' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ description: 'Estado del pago' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Referencia del proveedor' })
  @IsString()
  @IsNotEmpty()
  providerRef: string;

  @ApiProperty({ description: 'Metadatos adicionales del webhook' })
  @IsObject()
  metadata: Record<string, any>;
} 