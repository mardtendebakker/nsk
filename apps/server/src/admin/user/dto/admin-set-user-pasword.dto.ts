import { AdminUsernameDto } from "./admin-get-user.dto";

export class AdminSetUserPasswordDto extends AdminUsernameDto {
  password: string;
  permanent: boolean;
}
