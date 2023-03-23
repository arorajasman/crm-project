import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateUserDetails(@Param('id') id: string, @Body() data: any) {
    console.log('userData: ');
    console.log(data);
    return this.userService.updateUserDetails(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
