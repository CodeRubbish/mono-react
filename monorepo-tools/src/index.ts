#!/usr/bin/env node
import {program} from "commander";
import {version} from '../package.json';
import serve from './cli/serve';

program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation micro frontend project')
    .version(version);

program.command('serve')
    .description('serve projects')
    .option('--prod', 'production preset')
    .option('-p, --project <projectName>', 'projects for build')
    .option('-u, --unify [port]', 'build in one port')
    .option('-c, --config <configFile>', 'config file')
    .action(serve);

program.parse();