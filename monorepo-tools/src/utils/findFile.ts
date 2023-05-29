import fs from "fs";


export function findFile(...path: string[]) {
    const length = path.length;
    for (let i = 0; i < length; i++) {
        if (fs.existsSync(path[i])) {
            return require(path[i]);
        }
    }
}
