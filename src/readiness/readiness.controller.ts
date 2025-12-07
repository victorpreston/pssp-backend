import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReadinessService } from './readiness.service';
import { CreateReadinessDto } from './dto/create-readiness.dto';
import { UpdateReadinessDto } from './dto/update-readiness.dto';

@Controller('readiness')
export class ReadinessController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Post()
  create(@Body() createReadinessDto: CreateReadinessDto) {
    return this.readinessService.create(createReadinessDto);
  }

  @Get()
  findAll() {
    return this.readinessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.readinessService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReadinessDto: UpdateReadinessDto,
  ) {
    return this.readinessService.update(+id, updateReadinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.readinessService.remove(+id);
  }
}
