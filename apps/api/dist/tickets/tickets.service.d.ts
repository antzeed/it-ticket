import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createTicketDto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }>;
    findAll(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }[]>;
    findOne(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }>;
}
