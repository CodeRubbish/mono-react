#!/usr/bin/env node
import {Command, program} from "commander";
import {version} from '../package.json';
import serve from './cli/serve';
import build from "./cli/build";

program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation micro frontend project')
    .version(version);

const co = (command: Command) => {
    return command
        .option('--prod', 'production preset')
        .option('-p, --project <projectName>', 'projects for build')
        .option('-u, --unify [port]', 'build in one port')
        .option('-e, --env [env]', 'build environment')
        .option('-c, --config <configFile>', 'config file');
};
co(program.command('serve')
    .description('serve projects'))
    .action(serve);
co(program.command('build')
    .description('serve projects'))
    .action(build);
program.parse();