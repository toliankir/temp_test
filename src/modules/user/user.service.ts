import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entity/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserDtoResponse,
  PaginationDtoRequest,
  UsersDtoResponse,
  UserCreateDtoRequest,
} from '../../dto';
import tinify from 'tinify';
import Source from 'tinify/lib/tinify/Source';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly tinifyApiKey: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    const tinifyApiKey = this.configService.get<string>('TINIFY_API_KEY');

    if (!tinifyApiKey) {
      throw new Error('Miscofiguration TINIFY_API_KEY must be set');
    }
    this.tinifyApiKey = tinifyApiKey;
  }

  public async getUser(id: number, ownAddr: URL): Promise<UserDtoResponse> {
    const userEntity = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['position'],
    });
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      phone: userEntity.phone,
      position: userEntity.position.name,
      positionId: userEntity.position.id,
      photo: this.getUserPhotoLink(ownAddr),
    };
  }

  public async getUserImage(id: number): Promise<Buffer> {
    const userEntity = await this.userRepository.findOneOrFail({
      where: { id },
    });
    return userEntity.photo;
  }

  public async getUsers(
    offset: number,
    limit: number,
    ownAddr: URL,
  ): Promise<UsersDtoResponse & { readonly count: number }> {
    const userEntities = await this.userRepository.find({
      skip: offset,
      take: limit,
      relations: ['position'],
      order: { id: 'desc' },
    });

    const count: number = await this.userRepository.count();

    return {
      users: userEntities.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        position: e.position.name,
        positionId: e.position.id,
        photo: this.getUserPhotoLink(ownAddr, e.id),
      })),
      count,
    };
  }

  public async saveUser(
    user: UserCreateDtoRequest,
    fileBuffer: Buffer,
    tokenId: number,
  ): Promise<number> {
    const existingUserEntity = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone: user.phone }],
    });

    if (existingUserEntity) {
      throw new ConflictException(
        'User with this phone or email already exist',
      );
    }

    tinify.key = this.tinifyApiKey;
    const imageSource: Source = tinify.fromBuffer(fileBuffer);
    const resizedImage: Source = imageSource.resize({
      method: 'cover',
      width: 70,
      height: 70,
    });
    const resizedImageBuffer: Buffer = Buffer.from(
      await resizedImage.toBuffer(),
    );

    const newUserEntity: DeepPartial<UserEntity> = {
      name: user.name,
      positionId: user.positionId,
      tokenId,
      email: user.email,
      phone: user.phone,
      photo: resizedImageBuffer,
    };
    const createdUser = await this.userRepository.save(newUserEntity);

    return createdUser.id;
  }

  private getUserPhotoLink(ownAddr: URL, userId?: number): string {
    const pathParts = ownAddr.pathname.split('/');
    if (userId) {
      pathParts.push(userId.toString());
    }
    pathParts.push('image');

    return new URL(pathParts.join('/'), ownAddr).toString();
  }
}
