import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LiteCustomEmoji {
    @IsString()
    @ApiProperty({description: '絵文字の名前'})
    name: string;

    @IsString()
    @ApiProperty({description: '絵文字のUrl'})
    url: string;
}