import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import type { CreateDriverInput, CreateMerchantInput, CreatePlanInput } from './admin.types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Post('merchants')
  createMerchant(@Body() input: CreateMerchantInput) {
    return this.adminService.createMerchant(input);
  }

  @Post('drivers')
  createDriver(@Body() input: CreateDriverInput) {
    return this.adminService.createDriver(input);
  }

  @Post('plans')
  createPlan(@Body() input: CreatePlanInput) {
    return this.adminService.createPlan(input);
  }
}
