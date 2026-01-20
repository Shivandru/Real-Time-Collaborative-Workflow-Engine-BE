import { Router, type Request, type Response, type NextFunction, type RequestHandler, type RouterOptions } from "express";

class AppRouter {
    private router: Router;

    constructor(options?: RouterOptions) {
        this.router = Router(options);
    }

    public get(path: string, ...handlers: RequestHandler[]) {
        this.router.get(path, ...this.wrapHandlers(handlers));
    }

    public post(path: string, ...handlers: RequestHandler[]) {
        this.router.post(path, ...this.wrapHandlers(handlers));
    }

    public put(path: string, ...handlers: RequestHandler[]) {
        this.router.put(path, ...this.wrapHandlers(handlers));
    }

    public patch(path: string, ...handlers: RequestHandler[]) {
        this.router.patch(path, ...this.wrapHandlers(handlers));
    }

    public delete(path: string, ...handlers: RequestHandler[]) {
        this.router.delete(path, ...this.wrapHandlers(handlers));
    }

    public use(path: string, subRouter: AppRouter): void;
    public use(path: string, ...handlers: RequestHandler[]): void;
    public use(path: string, ...args: [AppRouter] | RequestHandler[]): void {
        if (args[0] instanceof AppRouter) {
            this.router.use(path, args[0].getRouter());
        } else {
            this.router.use(path, ...(args as RequestHandler[]));
        }
    }

    private wrapHandlers(handlers: RequestHandler[]) {
        return handlers.map((handler) => {
            return (req: Request, res: Response, next: NextFunction) => {
                Promise.resolve(handler(req, res, next)).catch(next);
            };
        });
    }

    public getRouter(): Router {
        return this.router;
    }

    public valueOf() {
        return this.router;
    }
}

export default AppRouter;
