import {URL} from 'url';
import express, {Request, Response} from 'express';
import dns, {LookupAddress} from 'dns';

class VirtualHost {

    private app: any;

    private targetHosts: Array<LookupAddress>;

    private listenUri: URL;
    private targetUri: URL;
    private name: String;
    private id: String;


    constructor(config: any) {
        console.log('Initializing ' + config.name + config.listenUri);
        this.listenUri = new URL(config.listenUri);
        this.targetUri = new URL(config.targetUri);
        this.id = config.id;
        this.name = config.name;
        this.app = express();
    }

    public run(): void {
        setInterval(this.lookup, 6000);
        console.log('Vhost is listening on' + this.listenUri.pathname + this.listenUri.port);
        this.app.all(this.listenUri.pathname, this.handleRequest);
        this.app.listen(this.listenUri.port);
    }

    private lookup(): void {
        dns.lookup(this.targetUri.hostname, {all: true, family: 4}, (err, addresses) => {
            console.log(addresses);
            this.targetHosts = addresses;
        });
    }

    private handleRequest(req: Request, res: Response): void {
        res.send(JSON.stringify(this.targetHosts));
    }

    public getTargetHostname(): string {
        return this.targetUri.hostname;
    }

}

export default VirtualHost;
