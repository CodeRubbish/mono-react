import chalk from 'chalk';

const {log} = console;
export default {
    warn: (info, ...others) => log(chalk.bgYellowBright.black(' warn : ' + info), ...others),
    error: (info, ...others) => log(chalk.bgRed.black(' error : ' + info), ...others)
};