import { IsEmail, IsNotEmpty } from 'class-validator';
import { Roles } from './roles.enum';

export class CreateUserDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  roles: Roles[];
}

export class UpdateUserDTO {
  email?: string;
  password?: string;
  refreshToken?: string;
}

export class FindUserDto {
  email?: string;
  refreshToken?: string;
}
