import { Body, Controller, Logger, Post } from '@nestjs/common';

import { RegisterUserRequestDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerUser(@Body() dto: RegisterUserRequestDto) {
    this.logger.log('registerUser');
    this.logger.log('%o', dto);

    return this.usersService.registerUser(dto);
  }
}
