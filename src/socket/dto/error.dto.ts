import { IDto } from './i.dto';

export class ErrorDto extends IDto<ErrorDto> {
  message: string;

  constructor(message: string) {
    super({ message: message });
  }
}
