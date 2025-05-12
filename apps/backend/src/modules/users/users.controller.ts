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
  ) {
    this.logger.log('getUserFavs');

    return this.usersService.getUserFavs(token);
  }

  @Post('/add-user-fav')
  async addUserFav(
    @Headers('authorization') token: string,
    @Body() dto: ToggleUserFavsRequestDto,
  ) {
    this.logger.log('addUserFav');
    this.logger.log('dto: %o', dto);

    return this.usersService.addUserFav(token, dto);
  }

  @Post('/remove-user-fav')
  async removeUserFav(
    @Headers('authorization') token: string,
    @Body() dto: ToggleUserFavsRequestDto,
  ) {
    this.logger.log('removeUserFav');
    this.logger.log('dto: %o', dto);

    return this.usersService.removeUserFav(token, dto);
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
