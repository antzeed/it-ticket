import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(req: any, createTicketDto: CreateTicketDto): Promise<{
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        assigneeId: string | null;
    }>;
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateData: any, req: any): Promise<{
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
