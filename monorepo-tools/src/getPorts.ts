import * as portfinder from "portfinder";
import {PortFinderOptions} from "portfinder";

export default function getPorts(number, options: PortFinderOptions = {
    port: 3000,
    stopPort: 65535,
}) {
    return new Promise((resolve, reject) => {
        portfinder.getPorts(number, options, function (err, ports) {
            if (err) {
                return reject(err);
            }
            resolve(ports);
        });
    });
}