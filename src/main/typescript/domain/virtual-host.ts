import {URL} from 'url';
import express, {NextFunction, Request, Response} from 'express';
import dns, {LookupAddress} from 'dns';
import http from 'http';
import https from 'https';
import {HostnameFilter} from '../filter/hostname-filter';

class VirtualHost {

    private app: any;

    private targetHosts: Array<String>;
    private hostnameFilter: HostnameFilter;

    private listenUri: URL;
    private readonly targetUri: URL;
    private name: String;
    private id: String;
    private client: any;

    constructor(config: any) {
        console.log('Initializing ' + config.name + config.listenUri);

        this.listenUri = new URL(config.listenUri);
        this.targetUri = new URL(config.targetUri);
        this.id = config.id;
        this.name = config.name;
        this.hostnameFilter = new HostnameFilter(this.listenUri.hostname);
        this.app = express();
        this.app.use(
            (req: Request, res: Response, next: NextFunction) => this.hostnameFilter.handle(req, res, next)
        );

        if (this.targetUri.protocol === 'https') {
            this.client = https;
        } else {
            this.client = http;
        }

        this.app.all(this.listenUri.pathname, (req: Request, res: Response) => this.handleRequest(req, res));
    }

    public run(): void {
        console.log('Vhost is listening on' + this.listenUri.pathname + this.listenUri.port);
        this.app.listen(this.listenUri.port);
    }

    private handleRequest(req: Request, res: Response) {

        const options = {
            hostname: this.targetUri.host,
            headers: req.headers,
            path: req.path,
            method: req.method,
            timeout: 5000,
            followAllRedirects: true,
        };

        options.headers.host = this.targetUri.host;

        this.client.get(options, (resp: any) => {
            res.header(resp.headers);
            res.statusCode = resp.statusCode;

            resp.on('data', (chunk: any) => {
                res.write(chunk);
            });

            resp.on('end', (data: any) => {
                res.end();
            });
        });
    }

    public getTargetHostname(): string {
        return this.targetUri.hostname;
    }

}

export default VirtualHost;
