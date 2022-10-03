#!/usr/bin/env node
'use strict';

var commander = require('commander');
var portfinder = require('portfinder');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var portfinder__namespace = /*#__PURE__*/_interopNamespace(portfinder);

var version = "1.0.0";

function getPorts(number, options = {
    port: 3000,
    stopPort: 65535,
}) {
    return new Promise((resolve, reject) => {
        portfinder__namespace.getPorts(number, options, function (err, ports) {
            if (err) {
                return reject(err);
            }
            resolve(ports);
        });
    });
}

commander.program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation micro frontend project')
    .version(version);
commander.program.command('start')
    .option('--prod', 'production preset')
    .option('-p, --project', 'project')
    .action(() => {
    // serve();
    getPorts(3).then(ports => {
        console.log(ports);
    });
});
commander.program.parse();
