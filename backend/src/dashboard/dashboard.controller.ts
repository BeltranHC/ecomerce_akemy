import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas generales del dashboard' })
  @ApiResponse({ status: 200, description: 'Estadísticas del dashboard' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales-chart')
  @ApiOperation({ summary: 'Obtener datos para gráfico de ventas' })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'year'], required: false })
  @ApiResponse({ status: 200, description: 'Datos del gráfico de ventas' })
  getSalesChart(@Query('period') period: 'week' | 'month' | 'year' = 'month') {
    return this.dashboardService.getSalesChart({ period });
  }

  @Get('orders-by-status')
  @ApiOperation({ summary: 'Obtener pedidos agrupados por estado' })
  @ApiResponse({ status: 200, description: 'Pedidos por estado' })
  getOrdersByStatus() {
    return this.dashboardService.getOrdersByStatus();
  }

  @Get('abandoned-carts')
  @ApiOperation({ summary: 'Obtener carritos abandonados' })
  @ApiResponse({ status: 200, description: 'Lista de carritos abandonados' })
  getAbandonedCarts() {
    return this.dashboardService.getAbandonedCarts();
  }

  @Get('sales-trends')
  @ApiOperation({ summary: 'Obtener tendencias de ventas con comparación' })
  @ApiResponse({ status: 200, description: 'Tendencias de ventas' })
  getSalesTrends() {
    return this.dashboardService.getSalesTrends();
  }

  @Get('category-performance')
  @ApiOperation({ summary: 'Obtener rendimiento por categoría' })
  @ApiResponse({ status: 200, description: 'Ventas por categoría' })
  getCategoryPerformance() {
    return this.dashboardService.getCategoryPerformance();
  }

  @Get('customer-metrics')
  @ApiOperation({ summary: 'Obtener métricas de clientes' })
  @ApiResponse({ status: 200, description: 'Métricas de clientes' })
  getCustomerMetrics() {
    return this.dashboardService.getCustomerMetrics();
  }
}

