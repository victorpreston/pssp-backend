import { PartialType } from '@nestjs/mapped-types';
import { CreateReadinessDto } from './create-readiness.dto';

export class UpdateReadinessDto extends PartialType(CreateReadinessDto) {}
