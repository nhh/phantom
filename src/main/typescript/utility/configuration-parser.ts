import VirtualHost from '../domain/virtual-host';
import fs from 'fs';

export class ConfigurationParser {

    private files = new Array<String>();

    constructor() {
        this.files = fs.readdirSync('./config').filter((file: string) => file.endsWith('_vhost.json'));
    }

    public parse(): VirtualHost[] {
        return this.files.map((file: string) => new VirtualHost(fs.readFileSync('./config/' + file).toJSON()));
    }
}
