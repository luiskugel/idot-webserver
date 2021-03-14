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
  constructor(port = 8080, cors = "*", morgan = "dev") {
    this.cors = cors;
    this.morgan = morgan;
    this.port = port;
    this.app = express();
  }
  listen() {
    this._setupCors();
    this._setupHandlers();
    this.app.listen(this.port);
    console.log("server listening on port: " + this.port);
  }
  _setupCors(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", this.cors);
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
  addRouter(route: string, router: Handler | Router, method = "all"): void {
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
