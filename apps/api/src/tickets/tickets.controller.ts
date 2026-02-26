import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Request() req: any, @Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(req.user.id, createTicketDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.ticketsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.ticketsService.findOne(id, req.user);
    }
}
