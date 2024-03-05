import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { ServiceResponse } from '../../types/service-response';
import { TokenDtoResponse } from '../../dto/token-response.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  public async getToken(): Promise<ServiceResponse<TokenDtoResponse>> {
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
