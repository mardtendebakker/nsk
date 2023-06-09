import { AdminUsernameDto } from "./admin-username.dto";

export class AdminSetUserPasswordDto extends AdminUsernameDto {
  password: string;
  permanent: boolean;
}
