import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'john.doe or john.doe@eample.com',
    description: 'Required field for email or username'
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'john.doe',
    description: 'Required field for password'
  })
  password: string;
}
