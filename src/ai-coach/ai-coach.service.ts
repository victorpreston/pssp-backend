/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateAiCoachDto } from './dto/create-ai-coach.dto';
import { UpdateAiCoachDto } from './dto/update-ai-coach.dto';

@Injectable()
export class AiCoachService {
  create(createAiCoachDto: CreateAiCoachDto) {
    return 'This action adds a new aiCoach';
  }

  findAll() {
    return `This action returns all aiCoach`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiCoach`;
  }

  update(id: number, updateAiCoachDto: UpdateAiCoachDto) {
    return `This action updates a #${id} aiCoach`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiCoach`;
  }
}
