import cluster, {Worker} from 'cluster';
import VirtualHost from './domain/virtual-host';
import cpu from 'os';
import {ConfigurationParser} from './utility/configuration-parser';
import {DnsLookupService} from './service/dns-lookup-service';


class Application {


    public static main() {

        const configurationParser = new ConfigurationParser();
        const vhosts = new Map<string, VirtualHost>();
        const workers = new Set<Worker>();

        if (cluster.isMaster) {
            console.log(`Master ${process.pid} is running`);
            for (let i = 0; i < cpu.cpus().length - 1 ; i++) {
                workers.add(cluster.fork());
            }
        } else {
            console.log(`Worker ${process.pid} started`);
            configurationParser.parse();
            vhosts.forEach((vhost) => {
                const lookupService = new DnsLookupService();
                lookupService.runLookupFor(vhost);
                // vhost.subscribe(lookupService.getEvents());
                vhost.run();
            });
        }
    }

}

Application.main();
