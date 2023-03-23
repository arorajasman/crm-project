import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserDTO } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable({})
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  // method to get list of all users
  async getListOfUsers() {
    try {
      const usersList = await this.databaseService.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        data: usersList,
      };
    } catch (error) {
      console.log('Error while getting list of user: ');
      console.log(error);
      throw error;
    }
  }

  // method to get details of user based on id
  async getUserDetailsById(userId: string) {
    try {
      const userData = await this.databaseService.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!userData) {
        throw new HttpException(
          `No User found with id ${userId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        data: userData,
      };
    } catch (error) {
      console.log('Error while getting details of user: ');
      console.log(error);
      throw error;
    }
  }

  // method to add user to db
  async createNewUser(userData: UserDTO) {
    try {
      // using array destructuring to get the details of the user from the userData
      const { firstName, lastName, email, password } = userData;
      if (!firstName) {
        throw new ForbiddenException('firstName is required');
      }
      if (!email) {
        throw new ForbiddenException('Email is required');
      }
      if (!password) {
        throw new ForbiddenException('password is required');
      }

      const passwordHash = await argon.hash(password);
      const user = await this.databaseService.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: passwordHash,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        data: user,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentails are already taken');
        }
      }
      console.log('Error while adding user to db: ');
      console.log(error);
      throw error;
    }
  }

  // method to update the details of the user
  async updateUserDetails(userId: string, userData: any) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        throw new ForbiddenException(`No User found with id ${userId}`);
      }

      const result = await this.databaseService.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'Details of user updated successfully',
        data: result,
      };
    } catch (error) {
      console.log('Error while updating user data in db: ');
      console.log(error);
      throw error;
    }
  }

  // method below is used to delete user by id
  async deleteUserById(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!user) {
        throw new ForbiddenException(`No User found with id ${id}`);
      }

      const result = await this.databaseService.user.delete({
        where: {
          id: parseInt(id),
        },
      });

      if (!result) {
        throw new ForbiddenException('Unable to delete the user');
      }

      return {
        message: 'User Deleted successfully',
      };
    } catch (error) {
      console.log('Error while delete user data in db: ');
      console.log(error);
      throw error;
    }
  }
}
