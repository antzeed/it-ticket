"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTicketDto) {
        return this.prisma.ticket.create({
            data: {
                ...createTicketDto,
                authorId: userId,
            },
        });
    }
    async findAll(user) {
        if (user.role === 'ADMIN') {
            return this.prisma.ticket.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        else {
            return this.prisma.ticket.findMany({
                where: { authorId: user.id },
                orderBy: { createdAt: 'desc' },
            });
        }
    }
    async findOne(id, user) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (user.role !== 'ADMIN' && ticket.authorId !== user.id) {
            throw new common_1.ForbiddenException('You can only view your own tickets');
        }
        return ticket;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map