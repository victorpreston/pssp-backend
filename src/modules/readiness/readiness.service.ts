/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateReadinessDto } from './dto/create-readiness.dto';
import { UpdateReadinessDto } from './dto/update-readiness.dto';

@Injectable()
export class ReadinessService {
  create(createReadinessDto: CreateReadinessDto) {
    return 'This action adds a new readiness';
  }

  findAll() {
    return `This action returns all readiness`;
  }

  findOne(id: number) {
    return `This action returns a #${id} readiness`;
  }

  update(id: number, updateReadinessDto: UpdateReadinessDto) {
    return `This action updates a #${id} readiness`;
  }

  remove(id: number) {
    return `This action removes a #${id} readiness`;
  }
}
