import { Application, Router, Handler } from "express";
export declare class Webserver {
    cors: string;
    morgan: string;
    app: Application;
    port: number;
    constructor(port?: number, cors?: string, morgan?: string);
    listen(): void;
    _setupCors(): void;
    _setupHandlers(): void;
    addRouter(route: string, router: Router, method?: string): void;
    addMiddleware(handler: Handler): void;
}
export declare class ConfigHandler {
    configPath: any;
    devMode: boolean;
    constructor(path?: string);
    load(): any;
}
