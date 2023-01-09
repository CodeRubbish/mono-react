#!/usr/bin/env node
import {program} from "commander";
import {version} from '../package.json';
import scan from "./scan";
import getPorts from "./getPorts";
import serve from "./serve";

program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation micro frontend project')
    .version(version);

program.command('start')
    .option('--prod', 'production preset')
    .option('-p, --project', 'project')
    .action(() => {
        const projects = scan();
        getPorts(projects.length).then(ports => {
            serve(projects, ports);
        });
    });

program.parse();