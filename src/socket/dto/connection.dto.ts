import { BroadcastMessageType } from '../enum/broadcast.message.type.enum';
import { BroadcastMessageDto } from './bradcast.message.dto';

export class ConnectionDto extends BroadcastMessageDto {
  constructor(clientName: string) {
    super({
      type: BroadcastMessageType.CONNECTED,
      data: { client: clientName },
    });
  }
}
