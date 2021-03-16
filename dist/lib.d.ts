import { Application, Router, Handler } from "express";
export declare class Webserver {
    cors: string;
    morgan: string;
    app: Application;
    port: number;
    constructor(port?: number, cors?: string, morgan?: string);
    initialize(): void;
    listen(): void;
    _setupCors(): void;
    _setupHandlers(): void;
    addRouter(route: string, method: string | undefined, router: Handler | Router): void;
    addMiddleware(handler: Handler): void;
}
export declare class ConfigHandler {
    configPath: any;
    devMode: boolean;
    constructor(path?: string);
    load(): any;
}
