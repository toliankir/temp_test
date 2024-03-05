import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserDtoResponse,
  PaginationDtoRequest,
  UsersDtoResponse,
} from '../../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getUser(id: number): Promise<UserDtoResponse> {
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
    };
  }

  public async getUsers(
    paginationFilter: PaginationDtoRequest,
  ): Promise<UsersDtoResponse & { readonly count: number }> {
    const skip: number =
      paginationFilter.offset ||
      (paginationFilter.page
        ? 0
        : (paginationFilter.page - 1) * paginationFilter.count);

    const userEntities = await this.userRepository.find({
      skip,
      take: paginationFilter.count,
      relations: ['position'],
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
      })),
      count,
    };
  }
}
