import { BroadcastMessageType } from '../enum/broadcast.message.type.enum';
import { BroadcastMessageDto } from './bradcast.message.dto';

export class DisconnectionDto extends BroadcastMessageDto {
  constructor(clientName: string) {
    super({
      type: BroadcastMessageType.DISCONNECTED,
      data: { client: clientName },
    });
  }
}
