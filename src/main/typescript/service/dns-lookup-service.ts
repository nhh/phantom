import {default as dns, LookupAddress} from 'dns';
import VirtualHost from '../domain/virtual-host';

export class DnsLookupService {

    private addressMap = new Map<String, string[]>();

    public runLookupFor(virtualHost: VirtualHost) {
        setInterval(() => {
            dns.resolve4(virtualHost.getTargetHostname(), (err, addresses) => {
                if (err) {
                    return;
                }
                console.log('Apply addresses for vhost ' + virtualHost.getTargetHostname() + addresses);
                this.addressMap.set(virtualHost.getTargetHostname(), addresses);
            });
        }, 60000);
    }

}
