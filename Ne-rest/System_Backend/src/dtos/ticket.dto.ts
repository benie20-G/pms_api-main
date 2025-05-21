import { IsNotEmpty, IsUUID, IsDateString, IsOptional } from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsUUID()
  carRecordId: string;
}

export class UpdateTicketDto {
  @IsOptional()
  @IsDateString()
  issuedAt?: string;
}

export class TicketResponseDto {
  id: string;
  carRecordId: string;
  issuedAt: Date;
  carRecord: {
    id: string;
    plateNumber: string;
    parking: {
      name: string;
      location: string;
    };
    user: {
      names: string;
    };
  };
}