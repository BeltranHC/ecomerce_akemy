import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ComparisonService } from './comparison.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('comparison')
@Controller('comparison')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  @Post('add')
  @ApiOperation({ summary: 'Agregar producto al comparador (máx 4)' })
  add(@CurrentUser('sub') userId: string, @Body('productId') productId: string) {
    return this.comparisonService.add(userId, productId);
  }

  @Post('remove')
  @ApiOperation({ summary: 'Quitar producto del comparador' })
  remove(@CurrentUser('sub') userId: string, @Body('productId') productId: string) {
    return this.comparisonService.remove(userId, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Vaciar comparador' })
  clear(@CurrentUser('sub') userId: string) {
    return this.comparisonService.clear(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos en comparador' })
  list(@CurrentUser('sub') userId: string) {
    return this.comparisonService.list(userId);
  }
}
