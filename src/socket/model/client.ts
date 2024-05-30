import { Socket } from 'socket.io';
import { BroadcastMessageDto } from '../dto/bradcast.message.dto';
import { ErrorDto } from '../dto/error.dto';
import { IDto } from '../dto/i.dto';
import { ErrorMessage } from '../enum/error.message.enum';
import { Topic } from '../enum/topic.enum';

export class Client {
  id: string;
  name: string;
  private _socket: Socket;

  constructor(args: Required<{ socket: Socket; name: string }>) {
    this.id = args.socket.id;
    this.name = args.name;
    this._socket = args.socket;
  }

  emit(topic: Topic, data: IDto<any>) {
    this._socket.emit(topic, data.stringify());
  }

  broadcast(message: BroadcastMessageDto) {
    this._socket.broadcast.emit(Topic.BROADCAST_MESSAGE, message.stringify());
  }

  emitError(message: ErrorMessage | string) {
    this.emit(Topic.ERROR_MESSAGE, new ErrorDto(message));
  }

  listen(topic: Topic, callback: (data: any) => void) {
    this._socket.on(topic, callback);
  }

  removeListener(topic: Topic) {
    this._socket.removeAllListeners(topic);
  }

  removeAllListeners() {
    this._socket.removeAllListeners();
  }

  disconnect() {
    this._socket.disconnect();
  }
}
