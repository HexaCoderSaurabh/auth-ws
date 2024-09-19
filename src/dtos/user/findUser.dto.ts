import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FindUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '2jjd9h_82h398h_2hh89h3h_fiwe9',
    description: "User's ID"
  })
  id: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe', description: "User's description" })
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com', description: "User's email" })
  email: string;
}
