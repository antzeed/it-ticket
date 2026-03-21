import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createTicketDto: CreateTicketDto) {
        return this.prisma.ticket.create({
            data: {
                ...createTicketDto,
                authorId: userId,
            },
        });
    }

    async findAll(user: any) {
        const includeRelations = {
             author: { select: { id: true, username: true, email: true } },
             assignee: { select: { id: true, username: true, email: true } }
        };

        if (user.role === 'ADMIN') {
            return this.prisma.ticket.findMany({
                orderBy: { createdAt: 'desc' },
                include: includeRelations,
            });
        } else {
            return this.prisma.ticket.findMany({
                where: { authorId: user.id },
                orderBy: { createdAt: 'desc' },
                include: includeRelations,
            });
        }
    }

    async findOne(id: string, user: any) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                 author: { select: { id: true, username: true, email: true } },
                 assignee: { select: { id: true, username: true, email: true } }
            }
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        if (user.role !== 'ADMIN' && ticket.authorId !== user.id) {
            throw new ForbiddenException('You can only view your own tickets');
        }

        return ticket;
    }

    async update(id: string, updateData: any, user: any) {
        const ticket = await this.findOne(id, user); 

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Only administrators can update ticket status');
        }

        return this.prisma.ticket.update({
            where: { id },
            data: updateData,
        });
    }
}
