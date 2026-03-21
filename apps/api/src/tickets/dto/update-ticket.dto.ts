import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  assigneeId?: string;
}
