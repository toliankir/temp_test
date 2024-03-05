import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ServiceResponse } from '../../types/service-response';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UserDtoRequest,
  PaginationDtoRequest,
  UsersDtoResponse,
  PaginationDtoResponse,
  SingleUserDtoResponse,
  UserCreateDtoRequest,
} from '../../dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async getUser(
    @Param() user: UserDtoRequest,
  ): Promise<ServiceResponse<SingleUserDtoResponse>> {
    return {
      success: true,
      user: await this.userService.getUser(user.id),
    };
  }

  @Get()
  public async getUsers(
    @Query() paginationFilter: PaginationDtoRequest,
  ): Promise<ServiceResponse<UsersDtoResponse & PaginationDtoResponse>> {
    const { users, count } = await this.userService.getUsers(paginationFilter);
    return {
      success: true,
      page:
        paginationFilter.page ||
        Math.trunc(paginationFilter.offset / paginationFilter.count) + 1,
      totalPages:
        count % paginationFilter.count === 0
          ? count / paginationFilter.count
          : Math.trunc(count / paginationFilter.count) + 1,
      totalUsers: count,
      count: users.length,
      links: {
        nextUrl: null,
        prevUrl: null,
      },
      users,
    };
  }

  // @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async saveUser(
    @UploadedFile() file,
    @Body() body: UserCreateDtoRequest,
  ): Promise<any> {
    console.log(file);
    console.log(body);
    // return await this.userService.getUser();
  }
}
