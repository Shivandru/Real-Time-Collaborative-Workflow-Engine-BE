import { ZodError, type ZodSchema } from "zod";
import HttpException from "../utils/exceptions/HttpException.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";
import type { Request, Response, NextFunction, RequestHandler } from "express";

type StorageKeys = "originalQuery" | "originalBody" | "originalHeaders" | "originalParams";

type RequestContainer = "query" | "body" | "headers" | "params";

interface CustomRequest extends Request {
    originalQuery?: unknown;
    originalBody?: unknown;
    originalHeaders?: unknown;
    originalParams?: unknown;
}

function buildErrorString(err: ZodError, container: string): string {
    return `Error validating ${container}: ${JSON.stringify(err.message)}`;
}

interface ExpressZodConfig {
    statusCode?: number;
    passError?: boolean;
}

interface ExpressZodInstance {
    body(schema: ZodSchema, opts?: ExpressZodConfig): RequestHandler;
    query(schema: ZodSchema, opts?: ExpressZodConfig): RequestHandler;
    params(schema: ZodSchema, opts?: ExpressZodConfig): RequestHandler;
    headers(schema: ZodSchema, opts?: ExpressZodConfig): RequestHandler;
    response(schema: ZodSchema, opts?: ExpressZodConfig): RequestHandler;
}

export function createValidator(cfg: ExpressZodConfig = {}): ExpressZodInstance {
    const containers: Record<RequestContainer, StorageKeys> = {
        query: "originalQuery",
        body: "originalBody",
        headers: "originalHeaders",
        params: "originalParams",
    };

    const instance: Partial<ExpressZodInstance> = {};

    Object.keys(containers).forEach((type) => {
        const storageKey = containers[type as RequestContainer];

        instance[type as keyof ExpressZodInstance] = (schema: ZodSchema, opts: ExpressZodConfig = {}): RequestHandler => {
            return (req: CustomRequest, _res: Response, next: NextFunction) => {
                try {
                    const data = req[type as RequestContainer];
                    const parsedData = schema.parse(data);

                    // Store the original data
                    req[storageKey] = data;

                    // Replace with parsed data
                    if (type === "query") {
                        Object.defineProperty(req, type, {
                            value: parsedData,
                            writable: false,
                        });
                    } else {
                        req[type as RequestContainer] = parsedData;
                    }

                    next();
                } catch (err) {
                    console.log(err);
                    if (err instanceof ZodError) {
                        const errorMessage = buildErrorString(err, `request ${type}`);

                        if (opts.passError || cfg.passError) {
                            next(err);
                        } else {
                            throw new HttpException(opts.statusCode || cfg.statusCode || HttpStatusCodes.ClientError.BAD_REQUEST, errorMessage);
                        }
                    } else {
                        next(err);
                    }
                }
            };
        };
    });

    instance.response = (schema: ZodSchema, opts: ExpressZodConfig = {}): RequestHandler => {
        return (_req: Request, res: Response, next: NextFunction) => {
            const originalJson = res.json.bind(res);

            res.json = (data: unknown): Response => {
                try {
                    if (data instanceof HttpException || res.statusCode >= 400) return originalJson(data);
                    const parsedData = schema.parse(data);
                    return originalJson(parsedData); // Ensure we always return the response
                } catch (err) {
                    if (err instanceof ZodError) {
                        const errorMessage = buildErrorString(err, "response");
                        if (opts.passError || cfg.passError) {
                            res.json = originalJson;
                            next(err);
                            return res;
                        } else {
                            res.json = originalJson;
                            next(
                                new HttpException(
                                    opts.statusCode || cfg.statusCode || HttpStatusCodes.ServerError.INTERNAL_SERVER_ERROR,
                                    errorMessage,
                                ),
                            );
                            return res;
                        }
                    } else {
                        res.json = originalJson;
                        next(err);
                        return res;
                    }
                }
            };
            next();
        };
    };

    return instance as ExpressZodInstance;
}
