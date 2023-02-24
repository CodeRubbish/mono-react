import * as path from "path";
import * as process from "process";

let shared;

export default function readSharedFromRoot() {
    if (!shared) shared = readSharedFromRootImpl();
    return shared;
}
const rootPath = path.resolve(process.cwd(), 'package.json');
const DEFAULT_SINGLETON = ['react', 'react-dom'];

function readSharedFromRootImpl() {
    const dependencies = require(rootPath).dependencies;
    const shared = {};
    Object.keys(dependencies).forEach(dep => {
        shared[dep] = ({
            import: dep,
            requiredVersion: dependencies[dep],
            singleton: DEFAULT_SINGLETON.includes(dep)
        });
    });
    console.log('shared', shared);
    return shared;
}