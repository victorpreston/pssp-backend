import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadinessService } from './services/readiness.service';
import { CalculateReadinessDto } from './dto/calculate-readiness.dto';
import { ReadinessResponseDto } from './dto/readiness-response.dto';

/** Handles readiness score calculation requests */
@ApiTags('readiness')
@Controller('readiness')
export class ReadinessController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Post('calculate')
  @ApiOperation({
    summary: 'Calculate learner readiness score',
    description:
      'Calculates overall readiness score with detailed breakdown and insights',
  })
  @ApiResponse({
    status: 201,
    description: 'Readiness score calculated successfully',
    type: ReadinessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  calculateReadiness(
    @Body() dto: CalculateReadinessDto,
  ): Promise<ReadinessResponseDto> {
    return this.readinessService.calculateReadiness(dto);
  }
}
