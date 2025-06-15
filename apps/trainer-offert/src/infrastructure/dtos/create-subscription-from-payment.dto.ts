import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionFromPaymentDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID de la oferta' })
  @IsString()
  @IsNotEmpty()
  offertId: string;

  @ApiProperty({ description: 'ID del pago' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;
} 