import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserDTO } from './dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getListOfUsers() {
    return this.userService.getListOfUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserDetailsById(@Param('id') id: string) {
    console.log(`userId: `);
    console.log(id);
    return this.userService.getUserDetailsById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createNewUser(@Body() data: UserDTO) {
    return this.userService.createNewUser(data);
  }
}
