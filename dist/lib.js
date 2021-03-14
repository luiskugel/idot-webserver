"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHandler = exports.Webserver = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
class Webserver {
    constructor(port = 8080, cors = "*", morgan = "dev") {
        this.cors = cors;
        this.morgan = morgan;
        this.port = port;
        this.app = express_1.default();
    }
    listen() {
        this._setupCors();
        this._setupHandlers();
        this.app.listen(this.port);
        console.log("server listening on port: " + this.port);
    }
    _setupCors() {
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", this.cors);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if (req.method === "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
                return res.status(200).json({});
            }
            next();
        });
    }
    _setupHandlers() {
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.use(morgan_1.default(this.morgan));
    }
    addRouter(route, router, method = "all") {
        switch (method) {
            case "post":
                this.app.post(route, router);
                break;
            case "get":
                this.app.get(route, router);
                break;
            case "put":
                this.app.put(route, router);
                break;
            case "delete":
                this.app.delete(route, router);
                break;
            case "patch":
                this.app.patch(route, router);
                break;
            default:
                //"all"
                this.app.use(route, router);
                break;
        }
    }
    addMiddleware(handler) {
        this.app.use(handler);
    }
}
exports.Webserver = Webserver;
class ConfigHandler {
    constructor(path = "../config/") {
        if (process.argv.includes("dev")) {
            this.configPath = path_1.default.join(path, "config_dev.json");
            this.devMode = true;
            console.log("Starting in dev mode!");
        }
        else {
            this.configPath = path_1.default.join(path, "config_pro.json");
            this.devMode = false;
        }
    }
    load() {
        const config = require(this.configPath);
        config.devMode = this.devMode;
        return config;
    }
}
exports.ConfigHandler = ConfigHandler;
