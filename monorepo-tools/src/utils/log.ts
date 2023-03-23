import chalk from 'chalk';

const {log} = console;
export default {
    info: (info, ...others) => log(chalk.greenBright.black(' info : ' + info), ...others),
    warn: (info, ...others) => log(chalk.bgYellowBright.black(' warn : ' + info), ...others),
    error: (info, ...others) => log(chalk.bgRed.black(' error : ' + info), ...others)
};