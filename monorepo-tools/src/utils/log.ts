import chalk from 'chalk';

const {log} = console;
export default {
    warn: (info) => log(chalk.bgYellowBright.black(' warn : ' + info)),
    error: (info) => log(chalk.bgRed.black(' error : ' + info))
};