import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createTicketDto: CreateTicketDto): Promise<{
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        assigneeId: string | null;
    }>;
    findAll(user: any): Promise<({
        author: {
            id: string;
            email: string;
            username: string;
        };
        assignee: {
            id: string;
            email: string;
            username: string;
        } | null;
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        assigneeId: string | null;
    })[]>;
    findOne(id: string, user: any): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
        };
        assignee: {
            id: string;
            email: string;
            username: string;
        } | null;
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        assigneeId: string | null;
    }>;
    update(id: string, updateData: any, user: any): Promise<{
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        assigneeId: string | null;
    }>;
}
