import { Body, Controller, Delete, Get, Headers, Logger, Post, Query } from '@nestjs/common';

import { RegisterUserRequestDto, SignInWithOAuthRequestDto, ToggleUserFavsRequestDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) { }

  @Get('/get-user-favs')
  async getUserFavs(
    @Headers('authorization') token: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    this.logger.log('getUserFavs');

    return this.usersService.getUserFavs(token, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
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

  @Post('/sign-in-with-oauth')
  async signInWithOAuth(@Body() dto: SignInWithOAuthRequestDto) {
    this.logger.log('signInWithOAuth');
    this.logger.log('%o', dto);

    return this.usersService.signInWithOAuth(dto);
  }

  @Delete()
  async deleteUser(@Headers('authorization') token: string) {
    this.logger.log('deleteUser');

    return this.usersService.deleteUser(token);
  }
}
