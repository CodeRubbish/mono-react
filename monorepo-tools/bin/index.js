#!/usr/bin/env node
'use strict';

var commander = require('commander');

var version = "1.0.0";

commander.program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation project')
    .version(version);
