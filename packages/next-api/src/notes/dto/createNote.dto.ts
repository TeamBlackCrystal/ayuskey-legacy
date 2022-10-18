
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString} from 'class-validator'

export class CreateNoteDto {
    @IsEnum(['public', 'home', 'followers', 'specified'])
    @ApiProperty({description: '公開範囲', enum: ['public', 'home', 'followers', 'specified'], default: 'public'})
    visibility: 'public' | 'home' | 'followers' | 'specified' = 'public'

    @IsString()
    @ApiProperty({description: '投稿する内容'})
    text?: string
}