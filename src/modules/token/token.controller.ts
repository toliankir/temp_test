import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { ServiceResponseDto } from '../../dto/service-response.dto';
import { TokenDtoResponse } from '../../dto/token-response.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  public async getToken(): Promise<ServiceResponseDto<TokenDtoResponse>> {
    try {
      const token = await this.tokenService.getNewToken();
      return {
        success: true,
        token,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }
}
