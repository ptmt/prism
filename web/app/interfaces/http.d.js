declare module "http" {
  declare class IncomingMessage extends stream$Readable {
    headers: Object;
    httpVersion: string;
    method: string;
    trailers: Object;
    setTimeout(msecs: number, callback: Function): void;
    socket: any;  // TODO net.Socket
    statusCode: number;
    url: String;
  }

  declare class OutgoingMessage extends stream$Stream {
    write(ins: string): void;
    end(): void;
  }

  declare class ClientRequest extends OutgoingMessage {
    // TODO
  }

  declare function createServer(): void;
}
