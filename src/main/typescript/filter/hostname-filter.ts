import {Request, Response, NextFunction} from 'express';

export class HostnameFilter {

    private readonly hostname: string;

    constructor(hostname: string) {
        this.hostname = hostname;
    }

    public handle(request: Request, response: Response, next: NextFunction) {
        if (this.hostname === request.hostname) {
            return next();
        } else {
            return response.end();
        }
    }
}
