#!/usr/bin/env node
import {program} from "commander";
import {version} from '../package.json';

program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation project')
    .version(version);