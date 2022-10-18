import { ApiProperty } from "@nestjs/swagger";
import { IsString, ValidateNested } from "class-validator";
import { LiteCustomEmoji } from "./emoji.dto";
import { IdDto } from "./id.dto";

export class LiteUserDto {
    @ApiProperty({description: 'ユーザーのId'})
    id: string;
    
    @ApiProperty({description: 'ユーザーのニックネーム'})
	nickname: string;

    @ApiProperty({description: 'ユーザーのhost'})
    @IsString()
	host: string | null;

    @ApiProperty({description: 'ユーザー名'})
	name: string;

    @ApiProperty({description: 'ユーザーのオンライン状態'})
	online_status: 'online' | 'active' | 'offline' | 'unknown';

    @ApiProperty({description: 'アバターのアドレス'})
	avatar_url: string;

    @ApiProperty({description: 'アバターのblurhash'})
	avatar_blurhash: string;

    @ApiProperty({description: 'ユーザーは猫です'})
    is_cat: boolean;

    @ApiProperty({description: 'ユーザーはお嬢様です'})
    is_lady: boolean;

    @ApiProperty({description: 'ユーザーはボットです'})
    is_admin: boolean;

    @ValidateNested()
    @ApiProperty({description: 'ユーザーが利用中の絵文字'})
	emojis: LiteCustomEmoji[];
}
