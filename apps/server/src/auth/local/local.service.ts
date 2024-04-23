import { Injectable, UnauthorizedException } from '@nestjs/common';

export type User = any;

@Injectable()
export class LocalService {
  // TODO: 
  private readonly users = [
    {
      userId: 1,
      username: 'test',
      password: 'Password@123',
    },
    {
      userId: 2,
      username: 'test2',
      password: 'pass',
    },
  ];

  constructor() {}

  async findOne(username: string): Promise<User | undefined>{
    return this.users.find(user => user.username === username)
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
}
