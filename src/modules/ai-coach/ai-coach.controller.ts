import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AiCoachService } from './ai-coach.service';
import { CreateAiCoachDto } from './dto/create-ai-coach.dto';
import { UpdateAiCoachDto } from './dto/update-ai-coach.dto';

@Controller('ai-coach')
export class AiCoachController {
  constructor(private readonly aiCoachService: AiCoachService) {}

  @Post()
  create(@Body() createAiCoachDto: CreateAiCoachDto) {
    return this.aiCoachService.create(createAiCoachDto);
  }

  @Get()
  findAll() {
    return this.aiCoachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiCoachService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiCoachDto: UpdateAiCoachDto) {
    return this.aiCoachService.update(+id, updateAiCoachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiCoachService.remove(+id);
  }
}
