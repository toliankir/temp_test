import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ServiceResponseDto } from '../../dto/service-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UserDtoRequest,
  PaginationDtoRequest,
  UsersDtoResponse,
  PaginationDtoResponse,
  SingleUserDtoResponse,
  UserCreateDtoRequest,
  UserCreateDtoResponse,
} from '../../dto';
import { AuthGuard } from '../../guards/token.guard';
import { GetTokenModel } from '../../decorators/get-token-model.decorator';
import { TokenModel } from '../../types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async getUser(
    @Param() user: UserDtoRequest,
  ): Promise<ServiceResponseDto<SingleUserDtoResponse>> {
    return {
      success: true,
      user: await this.userService.getUser(user.id),
    };
  }

  @Get('image/:id')
  @Header('Content-Type', 'image/jpeg')
  public async getUserImage(
    @Param() user: UserDtoRequest,
  ): Promise<StreamableFile> {
    const imageBuffer: Buffer = await this.userService.getUserImage(user.id);
    return new StreamableFile(imageBuffer);
  }

  @Get()
  public async getUsers(
    @Query() paginationFilter: PaginationDtoRequest,
  ): Promise<ServiceResponseDto<UsersDtoResponse & PaginationDtoResponse>> {
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

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async saveUser(
    @UploadedFile() file,
    @Body() body: UserCreateDtoRequest,
    @GetTokenModel() tokenModel: TokenModel,
  ): Promise<ServiceResponseDto<UserCreateDtoResponse>> {
    const userId = await this.userService.saveUser(
      body,
      file.buffer,
      tokenModel.id,
    );

    return {
      success: true,
      message: 'New user successfully registered',
      userId,
    };
  }
}
