import {
   IsNotEmpty,
   IsOptional,
   IsString,
   IsNumber,
   MaxLength,
   MinLength,
   Min,
   IsDateString,
 } from "class-validator";
 
 export class CreateParkingDTO {
   @IsString()
   @IsNotEmpty()
   @MinLength(3)
   @MaxLength(10)
   code: string;
 
   @IsString()
   @IsNotEmpty()
   @MaxLength(50)
   name: string;
 
   @IsString()
   @IsNotEmpty()
   @MaxLength(100)
   location: string;
 
   @IsNumber()
   @Min(1, { message: "Total spaces must be at least 1." })
   totalSpaces: number;
 
   @IsNumber()
   @Min(0, { message: "Fee per hour cannot be negative." })
   feePerHour: number;
 }
 
 export class UpdateParkingDTO {
   @IsOptional()
   @IsString()
   @MinLength(3)
   @MaxLength(10)
   code?: string;
 
   @IsOptional()
   @IsString()
   @MaxLength(50)
   name?: string;
 
   @IsOptional()
   @IsString()
   @MaxLength(100)
   location?: string;
 
   @IsOptional()
   @IsNumber()
   @Min(1)
   totalSpaces?: number;
 
   @IsOptional()
   @IsNumber()
   @Min(0)
   feePerHour?: number;
 }
 
 export class ExitCarRecordDto {
   @IsOptional()
   @IsDateString()
   exitTime?: string;
 
   @IsOptional()
   @IsNumber()
   @Min(0, { message: "Charged amount cannot be negative" })
   chargedAmount?: number;
 }
 