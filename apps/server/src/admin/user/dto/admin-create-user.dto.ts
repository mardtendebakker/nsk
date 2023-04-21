import { AdminUsernameDto } from "./admin-get-user.dto";

export class AdminCreateUserDto extends AdminUsernameDto {
  email: string;
}
