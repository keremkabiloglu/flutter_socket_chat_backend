import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway/socket.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
