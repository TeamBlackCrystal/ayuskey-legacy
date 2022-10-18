import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsObject, IsString, ValidateNested } from "class-validator";
import { LiteUserDto } from "src/common/dto/user.dto";

export class GetNoteDto {
    @IsString()
    @ApiProperty({description: 'ノートのId'})
    id: string

    @IsDate()
    @ApiProperty({description: 'ノートの作成日時'})
    created_at: Date

    @IsString()
    @ApiProperty({description: 'ノートの内容'})
    text?: string | null

    @IsString()
    @ApiProperty({description: 'ノート内容に対する警告'})
    cw?: string

    @IsString()
    @ApiProperty({description: 'ノートの作成者のユーザーId'})
    author_id: string

    @ValidateNested()
    @ApiProperty({description: 'ノートの作者'})
    author: LiteUserDto
}

