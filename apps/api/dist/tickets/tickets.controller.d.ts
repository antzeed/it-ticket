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
    }>;
    findAll(req: any): Promise<{
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
    }>;
}
