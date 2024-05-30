import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionDto } from './dto/connection.dto';
import { DisconnectionDto } from './dto/disconnection.dto';
import { PrivateMessage } from './dto/private.message.dto';
import { ErrorMessage } from './enum/error.message.enum';
import { Topic } from './enum/topic.enum';
import { Client } from './model/client';

@Injectable()
export class SocketService {
  private readonly clients: Client[] = [];

  handleConnection(socket: Socket) {
    let name = socket.handshake.query.name;
    name = name ? (Array.isArray(name) ? name[0] : name) : undefined;
    if (name) {
      const client = new Client({
        name: name,
        socket,
      });
      this._addClient(client);
    } else {
      socket.emit(Topic.PRIVATE_MESSAGE, ErrorMessage.NAME_REQUIRED);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const client = this.clients.find((c) => c.id === socket.id);
    if (client) {
      this._removeClient(client);
    }
  }

  private _addClient(client: Client) {
    this.clients.push(client);
    client.listen(Topic.PRIVATE_MESSAGE, (data: string) =>
      this._onPrivateMessage(client, data),
    );
    client.broadcast(new ConnectionDto(client.name));
    this.clients
      .filter((c) => c.name !== client.name)
      .forEach((c) => {
        client.emit(Topic.BROADCAST_MESSAGE, new ConnectionDto(c.name));
      });
  }

  private _removeClient(client: Client) {
    const index = this.clients.findIndex((c) => c.id === client.id);
    if (index !== -1) {
      client.removeAllListeners();
      client.broadcast(new DisconnectionDto(client.name));
      this.clients.splice(index, 1);
    }
  }

  private _onPrivateMessage(client: Client, data: string) {
    try {
      const obj = JSON.parse(data);
      if (obj.to && obj.message) {
        const toClient = this.clients.find((c) => c.name === obj.to);
        if (toClient) {
          if (toClient.name !== client.name) {
            const messageId = uuidv4().toString();
            const message = new PrivateMessage({
              id: messageId,
              from: client.name,
              to: toClient.name,
              message: obj.message,
              date: new Date(),
            });
            toClient.emit(Topic.PRIVATE_MESSAGE, message);
            client.emit(Topic.PRIVATE_MESSAGE, message);
          } else {
            client.emitError(ErrorMessage.SELF_MESSAGE);
          }
        } else {
          client.emitError(ErrorMessage.CLIENT_NOT_FOUND);
        }
      } else {
        client.emitError(ErrorMessage.BAD_REQUEST);
      }
    } catch (error) {
      client.emitError(`${error.message}`);
    }
  }
}
