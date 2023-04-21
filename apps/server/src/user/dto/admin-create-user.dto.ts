import { AdminGetUserDto } from "./admin-get-user.dto";

export class AdminCreateUserDto extends AdminGetUserDto {
  email: string;
}
