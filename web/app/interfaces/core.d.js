// declare var document : {
//   errno?: any;
//   code?: string;
//   path?: string;
//   syscall?: string;
// }
// //
// declare class ReadableStream extends EventEmitter {
//   readable: boolean;
//   read(size?: number): any;
//   setEncoding(encoding: string): void;
//   pause(): void;
//   resume(): void;
//   pipe(destination: any, options?: { end?: boolean; }): any;
//   //unpipe<T>(destination?: T): void;
//   //pipe<T extends WritableStream>(destination: T, options?: { end?: boolean; }): T;
//   //unpipe<T extends WritableStream>(destination?: T): void;
//   unshift(chunk: string): void;
//   unshift(chunk: Buffer): void;
//   wrap(oldStream: ReadableStream): ReadableStream;
// }
//
// declare class WritableStream extends EventEmitter {
//   writable: boolean;
//   write(buffer: Buffer, cb?: Function): boolean;
//   write(str: string, cb?: Function): boolean;
//   write(str: string, encoding?: string, cb?: Function): boolean;
//   end(): void;
//   end(buffer: Buffer, cb?: Function): void;
//   end(str: string, cb?: Function): void;
//   end(str: string, encoding?: string, cb?: Function): void;
// }
//
//
// declare class FSWatcher extends EventEmitter {
//   close(): void;
// }
//
// declare class ReadStream extends ReadableStream {
//   close(): void;
// }
// declare class WriteStream extends WritableStream {
//   close(): void;
// }
//
// declare module "fs" {
//   declare class Stats {
//     isFile(): boolean;
//     isDirectory(): boolean;
//     isBlockDevice(): boolean;
//     isCharacterDevice(): boolean;
//     isSymbolicLink(): boolean;
//     isFIFO(): boolean;
//     isSocket(): boolean;
//     dev: number;
//     ino: number;
//     mode: number;
//     nlink: number;
//     uid: number;
//     gid: number;
//     rdev: number;
//     size: number;
//     blksize: number;
//     blocks: number;
//     atime: Date;
//     mtime: Date;
//     ctime: Date;
//   }
//
//   declare function rename(oldPath: string, newPath: string, callback?: (err?: ErrnoException) => void): void;
//   declare function renameSync(oldPath: string, newPath: string): void;
//   declare function truncate(path: string, callback?: (err?: ErrnoException) => void): void;
//   declare function truncate(path: string, len: number, callback?: (err?: ErrnoException) => void): void;
//   declare function truncateSync(path: string, len?: number): void;
//   declare function ftruncate(fd: number, callback?: (err?: ErrnoException) => void): void;
//   declare function ftruncate(fd: number, len: number, callback?: (err?: ErrnoException) => void): void;
//   declare function ftruncateSync(fd: number, len?: number): void;
//   declare function chown(path: string, uid: number, gid: number, callback?: (err?: ErrnoException) => void): void;
//   declare function chownSync(path: string, uid: number, gid: number): void;
//   declare function fchown(fd: number, uid: number, gid: number, callback?: (err?: ErrnoException) => void): void;
//   declare function fchownSync(fd: number, uid: number, gid: number): void;
//   declare function lchown(path: string, uid: number, gid: number, callback?: (err?: ErrnoException) => void): void;
//   declare function lchownSync(path: string, uid: number, gid: number): void;
//   declare function chmod(path: string, mode: number, callback?: (err?: ErrnoException) => void): void;
//   declare function chmod(path: string, mode: string, callback?: (err?: ErrnoException) => void): void;
//   declare function chmodSync(path: string, mode: number): void;
//   declare function chmodSync(path: string, mode: string): void;
//   declare function fchmod(fd: number, mode: number, callback?: (err?: ErrnoException) => void): void;
//   declare function fchmod(fd: number, mode: string, callback?: (err?: ErrnoException) => void): void;
//   declare function fchmodSync(fd: number, mode: number): void;
//   declare function fchmodSync(fd: number, mode: string): void;
//   declare function lchmod(path: string, mode: number, callback?: (err?: ErrnoException) => void): void;
//   declare function lchmod(path: string, mode: string, callback?: (err?: ErrnoException) => void): void;
//   declare function lchmodSync(path: string, mode: number): void;
//   declare function lchmodSync(path: string, mode: string): void;
//   declare function stat(path: string, callback?: (err: ErrnoException, stats: Stats) => any): void;
//   declare function lstat(path: string, callback?: (err: ErrnoException, stats: Stats) => any): void;
//   declare function fstat(fd: number, callback?: (err: ErrnoException, stats: Stats) => any): void;
//   declare function statSync(path: string): Stats;
//   declare function lstatSync(path: string): Stats;
//   declare function fstatSync(fd: number): Stats;
//   declare function link(srcpath: string, dstpath: string, callback?: (err?: ErrnoException) => void): void;
//   declare function linkSync(srcpath: string, dstpath: string): void;
//   declare function symlink(srcpath: string, dstpath: string, type?: string, callback?: (err?: ErrnoException) => void): void;
//   declare function symlinkSync(srcpath: string, dstpath: string, type?: string): void;
//   declare function readlink(path: string, callback?: (err: ErrnoException, linkString: string) => any): void;
//   declare function readlinkSync(path: string): string;
//   declare function realpath(path: string, callback?: (err: ErrnoException, resolvedPath: string) => any): void;
//   declare function realpath(path: string, cache: {[path: string]: string}, callback: (err: ErrnoException, resolvedPath: string) =>any): void;
//   declare function realpathSync(path: string, cache?: {[path: string]: string}): string;
//   declare function unlink(path: string, callback?: (err?: ErrnoException) => void): void;
//   declare function unlinkSync(path: string): void;
//   declare function rmdir(path: string, callback?: (err?: ErrnoException) => void): void;
//   declare function rmdirSync(path: string): void;
//   declare function mkdir(path: string, callback?: (err?: ErrnoException) => void): void;
//   declare function mkdir(path: string, mode: number, callback?: (err?: ErrnoException) => void): void;
//   declare function mkdir(path: string, mode: string, callback?: (err?: ErrnoException) => void): void;
//   declare function mkdirSync(path: string, mode?: number): void;
//   declare function mkdirSync(path: string, mode?: string): void;
//   declare function readdir(path: string, callback?: (err: ErrnoException, files: string[]) => void): void;
//   declare function readdirSync(path: string): string[];
//   declare function close(fd: number, callback?: (err?: ErrnoException) => void): void;
//   declare function closeSync(fd: number): void;
//   declare function open(path: string, flags: string, callback?: (err: ErrnoException, fd: number) => any): void;
//   declare function open(path: string, flags: string, mode: number, callback?: (err: ErrnoException, fd: number) => any): void;
//   declare function open(path: string, flags: string, mode: string, callback?: (err: ErrnoException, fd: number) => any): void;
//   declare function openSync (path: string, flags: string, mode?: number): number;
//   declare function openSync (path: string, flags: string, mode?: string): number;
//   declare function utimes(path: string, atime: number | Date, mtime: number | Date, callback?: (err?: ErrnoException) => void): void;
//   declare function utimesSync(path: string, atime: number | Date, mtime: number | Date): void;
//   declare function futimes(fd: number, atime: number | Date, mtime: number | Date, callback?: (err?: ErrnoException) => void): void;
//   declare function futimesSync(fd: number, atime: number | Date, mtime: number | Date): void;
//   declare function fsync(fd: number, callback?: (err?: ErrnoException) => void): void;
//   declare function fsyncSync(fd: number): void;
//   declare function write(fd: number, buffer: Buffer, offset: number, length: number, position: number, callback?: (err: ErrnoException, written: number, buffer: Buffer) => void): void;
//   declare function writeSync(fd: number, buffer: Buffer, offset: number, length: number, position: number): number;
//   declare function read(fd: number, buffer: Buffer, offset: number, length: number, position: number, callback?: (err: ErrnoException, bytesRead: number, buffer: Buffer) => void): void;
//   declare function readSync(fd: number, buffer: Buffer, offset: number, length: number, position: number): number;
//   declare function readFile(filename: string, encoding: string, callback: (err: ErrnoException, data: string | Buffer) => void): void;
//   declare function readFile(filename: string, options: { encoding: string; flag?: string; }, callback: (err: ErrnoException, data: string | Buffer) => void): void;
//   declare function readFileSync(filename: string, encoding?: string): Buffer | string;
//   declare function readFileSync(filename: string, options?: { encoding?: string; flag?: string; }): Buffer | string;
//   declare function writeFile(filename: string, data: any, callback?: (err: ErrnoException) => void): void;
//   declare function writeFile(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }, callback?: (err: ErrnoException) => void): void;
//   declare function writeFile(filename: string, data: any, options: { encoding?: string; mode?: string; flag?: string; }, callback?: (err: ErrnoException) => void): void;
//   declare function writeFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number; flag?: string; }): void;
//   declare function writeFileSync(filename: string, data: any, options?: { encoding?: string; mode?: string; flag?: string; }): void;
//   declare function appendFile(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }, callback?: (err: ErrnoException) => void): void;
//   declare function appendFile(filename: string, data: any, options: { encoding?: string; mode?: string; flag?: string; }, callback?: (err: ErrnoException) => void): void;
//   declare function appendFile(filename: string, data: any, callback?: (err: ErrnoException) => void): void;
//   declare function appendFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number; flag?: string; }): void;
//   declare function appendFileSync(filename: string, data: any, options?: { encoding?: string; mode?: string; flag?: string; }): void;
//   declare function watchFile(filename: string, listener: (curr: Stats, prev: Stats) => void): void;
//   declare function watchFile(filename: string, options: { persistent?: boolean; interval?: number; }, listener: (curr: Stats, prev: Stats) => void): void;
//   declare function unwatchFile(filename: string, listener?: (curr: Stats, prev: Stats) => void): void;
//   declare function watch(filename: string, listener?: (event: string, filename: string) => any): FSWatcher;
//   declare function watch(filename: string, options: { persistent?: boolean; }, listener?: (event: string, filename: string) => any): FSWatcher;
//   declare function exists(path: string, callback?: (exists: boolean) => void): void;
//   declare function existsSync(path: string): boolean;
//   declare function createReadStream(path: string, options?: {
//     flags?: string;
//     encoding?: string;
//     fd?: string;
//     mode?: number;
//     bufferSize?: number;
//   }): ReadStream;
//   declare function createReadStream(path: string, options?: {
//     flags?: string;
//     encoding?: string;
//     fd?: string;
//     mode?: string;
//     bufferSize?: number;
//   }): ReadStream;
//   declare function createWriteStream(path: string, options?: {
//     flags?: string;
//     encoding?: string;
//     string?: string;
//   }): WriteStream;
// }
