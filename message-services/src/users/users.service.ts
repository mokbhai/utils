import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

const dataFilePath = path.join(process.cwd(), 'users.json');

@Injectable()
export class UsersService {
  private users: UserDTO[] = [];

  constructor() {
    this.loadData().catch(console.error);
  }

  async create(user: UserDTO): Promise<UserDTO> {
    this.users.push(user);
    await this.saveDataToFile();
    return user;
  }

  async findAll(): Promise<UserDTO[]> {
    return this.users;
  }

  async findOne(id: string): Promise<UserDTO | undefined> {
    return this.users.find((user) => user.token === id);
  }

  async isAdmin(id: string): Promise<boolean> {
    const user = this.users.find((user) => user.token === id);

    if (user && user.name === 'Admin') return true;
    return false;
  }

  async update(id: string, updatedUser: UserDTO): Promise<UserDTO | undefined> {
    const userIndex = this.users.findIndex((user) => user.token === id);
    if (userIndex === -1) {
      return undefined;
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
    await this.saveDataToFile();
    return this.users[userIndex];
  }

  async remove(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.token === id);
    if (userIndex === -1) {
      return false;
    }
    this.users.splice(userIndex, 1);
    await this.saveDataToFile();
    return true;
  }

  private async loadData(): Promise<void> {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      this.users = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.users = [];
      } else {
        throw error;
      }
    }
  }

  private async saveDataToFile(): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(this.users, null, 2));
  }
}
