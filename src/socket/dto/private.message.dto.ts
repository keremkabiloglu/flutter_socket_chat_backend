import { IDto } from './i.dto';

export class PrivateMessage extends IDto<PrivateMessage> {
  id: string;
  from: string;
  to: string;
  message: string;
}
