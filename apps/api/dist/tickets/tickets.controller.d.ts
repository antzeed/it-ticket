import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(req: any, createTicketDto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        authorId: string;
    }>;
}
