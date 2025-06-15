import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID del usuario que realiza el pago' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID del gimnasio' })
  @IsString()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Monto del pago' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Moneda del pago' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Proveedor de pago' })
  @IsString()
  @IsNotEmpty()
  provider: string;
} 