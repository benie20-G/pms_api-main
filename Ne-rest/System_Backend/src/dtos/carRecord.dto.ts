import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches
  
} from "class-validator";

export class CreateCarRecordDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/i, {
    message: "Plate number must follow format like RAE123C",
  })
  plateNumber: string;

  @IsNotEmpty()
  @IsUUID()
  parkingId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
import {
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from "class-validator";

export class ExitCarRecordDto {
  @IsOptional()
  @IsDateString()
  exitTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Charged amount cannot be negative" })
  chargedAmount?: number;
}

export class UpdateCarRecordDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/i, {
    message: "Plate number must follow format like RAE123C",
  })
  plateNumber?: string;

  @IsOptional()
  @IsUUID()
  parkingId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  exitTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Charged amount cannot be negative" })
  chargedAmount?: number;
}
