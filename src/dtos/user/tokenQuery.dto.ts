import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe', description: "User's description" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'One time validation token' })
  token: string;
}
