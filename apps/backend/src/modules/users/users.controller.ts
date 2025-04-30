import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';

import { RegisterUserRequestDto, ToggleUserFavsRequestDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) { }

  @Get('/get-user-favs')
  async getUserFavs(@Headers('authorization') token: string) {
    this.logger.log('getUserFavs');

    return this.usersService.getUserFavs(token);
  }

  @Post('/toggle-user-favs')
  async toggleUserFavs(
    @Headers('authorization') token: string,
    @Body() dto: ToggleUserFavsRequestDto,
  ) {
    this.logger.log('toggleUserFavs');
    this.logger.log('dto: %o', dto);

    return this.usersService.toggleUserFavs(token, dto);
  }

  @Post()
  async registerUser(@Body() dto: RegisterUserRequestDto) {
    this.logger.log('registerUser');
    this.logger.log('%o', dto);

    return this.usersService.registerUser(dto);
  }
}
