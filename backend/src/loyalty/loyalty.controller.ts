import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Consultar puntos' })
  balance(@CurrentUser('sub') userId: string) {
    return this.loyaltyService.getBalance(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Historial de puntos' })
  transactions(@CurrentUser('sub') userId: string) {
    return this.loyaltyService.getTransactions(userId);
  }
}
