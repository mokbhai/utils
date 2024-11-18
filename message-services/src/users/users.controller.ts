import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { UsersGuard } from './users.guard';

@UseGuards(UsersGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: UserDTO): Promise<UserDTO> {
    const token = uuidv4().replace(/-/g, '').substring(0, 50); // Generate unique token
    const newUser = { ...userData, token, createdAt: new Date() };
    return this.usersService.create(newUser);
  }

  @Get()
  async findAll(): Promise<UserDTO[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UserDTO,
  ): Promise<UserDTO> {
    const updatedUser = await this.usersService.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.usersService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
