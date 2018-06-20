import cluster from 'cluster';
import VirtualHost from './domain/virtual-host';
import * as fs from 'fs';
import cpu from 'os';

class Application {

    public files = new Array<String>();
    public vhosts = new Array<VirtualHost>();

    constructor() {
        this.files = fs.readdirSync('./config');
    }

    public main() {
        if (cluster.isMaster) {
            console.log(`Master ${process.pid} is running`);
            for (let i = 0; i < cpu.cpus().length - 1 ; i++) {
                cluster.fork();
            }
        } else {
            console.log(`Worker ${process.pid} started`);
            this.parseFiles();
            this.startVirtualHosts();
        }
    }

    private parseFiles() {
        this.files.forEach((file: String) => {
            if (file.endsWith('_vhost.json')) {
                const vhostFile = JSON.parse(fs.readFileSync('./config/' + file).toString());
                this.vhosts.push(new VirtualHost(vhostFile));
            }
        });
    }

    private startVirtualHosts() {
        this.vhosts.forEach((vhost: VirtualHost) => {
            vhost.run();
        });
    }

}

new Application().main();
