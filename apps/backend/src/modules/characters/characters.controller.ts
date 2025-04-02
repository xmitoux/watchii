import { Controller, Get, Logger } from '@nestjs/common';

import { CharactersService } from './characters.service';
import { FindAllCharactersResponse } from './entities/characters.entity';

@Controller('/api/characters')
export class CharactersController {
  private readonly logger = new Logger(CharactersController.name);

  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    this.logger.log('findAllCharacters');

    return this.charactersService.findAllCharacters();
  }
}
