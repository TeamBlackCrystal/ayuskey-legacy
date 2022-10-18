import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class IdDto {
    @IsString()
    @ApiProperty({description: 'id'})
    id: string
}