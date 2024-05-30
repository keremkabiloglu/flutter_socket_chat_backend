import { BroadcastMessageType } from '../enum/broadcast.message.type.enum';
import { IDto } from './i.dto';

export class BroadcastMessageDto extends IDto<BroadcastMessageDto> {
  type: BroadcastMessageType;
  data: any;
}
