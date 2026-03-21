export class CreateTicketDto {
    title!: string;
    description!: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    imageUrl?: string;
}
