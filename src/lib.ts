import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
  Handler,
} from "express";
import morgan from "morgan";
import pathLib from "path";

export class Webserver {
  cors: string;
  morgan: string;
  app: Application;
  port: number;
  credentials: boolean;
  constructor(port = 8080, cors = "*", morgan = "dev", credentials = true) {
    this.cors = cors;
    this.morgan = morgan;
    this.port = port;
    this.app = express();
    this.credentials = credentials;
  }
  initialize() {
    this._setupCors();
    this._setupHandlers();
  }
  listen() {
    this.app.listen(this.port);
    console.log("server listening on port: " + this.port);
  }
  _setupCors(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", this.cors);
      res.header(
        "Access-Control-Allow-Credentials",
        this.credentials.toString()
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method === "OPTIONS") {
        res.header(
          "Access-Control-Allow-Methods",
          "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
      }
      next();
    });
  }
  _setupHandlers(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan(this.morgan));
  }
  addRouter(route: string, method = "all", router: Handler | Router): void {
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
  addMiddleware(handler: Handler): void {
    this.app.use(handler);
  }
}

export class ConfigHandler {
  configPath: any;
  devMode: boolean;
  constructor(path = "../config/") {
    if (process.argv.includes("dev")) {
      this.configPath = "config_dev.json";
      this.devMode = true;
      console.log("Starting in dev mode!");
    } else {
      this.configPath = "config_pro.json";
      this.devMode = false;
    }
    this.configPath = pathLib.join(process.cwd(), path, this.configPath);
  }
  load() {
    const config = require(this.configPath);
    config.devMode = this.devMode;
    return config;
  }
}
