import {
  BadRequestException,
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
import { GetAddressDecorator } from 'src/decorators/get-get-address.decorator';

@Controller('users')
export class UserController {
  private static MAX_FILE_SIZE = 5000000;
  private static ALLOWED_FILE_TYPES = ['image/jpeg'];

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async getUser(
    @Param() user: UserDtoRequest,
    @GetAddressDecorator() ownAddr: URL,
  ): Promise<ServiceResponseDto<SingleUserDtoResponse>> {
    return {
      success: true,
      user: await this.userService.getUser(user.id, ownAddr),
    };
  }

  @Get(':id/image')
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
    @GetAddressDecorator() ownAddr: URL,
  ): Promise<ServiceResponseDto<UsersDtoResponse & PaginationDtoResponse>> {
    const offset: number =
      paginationFilter.offset ||
      (paginationFilter.page
        ? (paginationFilter.page - 1) * paginationFilter.count
        : 0);

    const { users, count } = await this.userService.getUsers(
      offset,
      paginationFilter.count,
      ownAddr,
    );

    const page =
      paginationFilter.page ||
      Math.trunc(paginationFilter.offset / paginationFilter.count) + 1;

    const totalPages =
      count % paginationFilter.count === 0
        ? count / paginationFilter.count
        : Math.trunc(count / paginationFilter.count) + 1;

    const nextUrl =
      offset + paginationFilter.count < count
        ? paginationFilter.offset !== undefined
          ? this.getUserPageLink(ownAddr, {
              offset: paginationFilter.offset + paginationFilter.count,
            })
          : this.getUserPageLink(ownAddr, { page: paginationFilter.page + 1 })
        : null;

    const prevUrl = (() => {
      if (offset === 0) {
        return null;
      }

      if (offset - paginationFilter.count < 0) {
        return paginationFilter.offset !== undefined
          ? this.getUserPageLink(ownAddr, { offset: 0 })
          : this.getUserPageLink(ownAddr, { page: 0 });
      } else {
        return paginationFilter.offset !== undefined
          ? this.getUserPageLink(ownAddr, {
              offset: paginationFilter.offset - paginationFilter.count,
            })
          : this.getUserPageLink(ownAddr, { page: paginationFilter.page - 1 });
      }
    })();

    return {
      success: true,
      page,
      totalPages,
      totalUsers: count,
      count: users.length,
      links: {
        nextUrl,
        prevUrl,
      },
      users,
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  public async saveUser(
    @UploadedFile() photo: Express.Multer.File,
    @Body() body: UserCreateDtoRequest,
    @GetTokenModel() tokenModel: TokenModel,
  ): Promise<ServiceResponseDto<UserCreateDtoResponse>> {
    if (!photo || Array.isArray(photo)) {
      throw new BadRequestException();
    }

    if (photo.size > UserController.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Maximum file size - ${UserController.MAX_FILE_SIZE} bytes`,
      );
    }

    if (!UserController.ALLOWED_FILE_TYPES.includes(photo.mimetype)) {
      throw new BadRequestException(
        `Allowed file types - ${UserController.ALLOWED_FILE_TYPES.join(',')}`,
      );
    }

    const userId = await this.userService.saveUser(
      body,
      photo.buffer,
      tokenModel.id,
    );

    return {
      success: true,
      message: 'New user successfully registered',
      userId,
    };
  }

  private getUserPageLink(
    ownAddr: URL,
    opts: {
      readonly offset?: number;
      readonly page?: number;
    },
  ): string {
    const newUrl = new URL(ownAddr);
    if (opts.offset) {
      newUrl.searchParams.set('offset', opts.offset.toString());
    }
    if (opts.page) {
      newUrl.searchParams.set('page', opts.page.toString());
    }

    return newUrl.toString();
  }
}
