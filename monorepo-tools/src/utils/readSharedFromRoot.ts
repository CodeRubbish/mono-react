import fs from "fs";
import path from "path";
import {PACKAGE_JSON, ROOT_PATH} from "../const";
import log from "./log";

let shared;

export default function readSharedFromRoot() {
    if (!shared) shared = readSharedFromRootImpl();
    return shared;
}
const PACKAGE_JSON_PATH = path.resolve(ROOT_PATH, PACKAGE_JSON);
const DEFAULT_SINGLETON = ['react', 'react-dom'];

function readSharedFromRootImpl() {
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
        log.warn(`the project do not share any dependency,please make sure.
        if you want shared dependency between different project,create package.json in your project root path`);
    }
    const dependencies = require(PACKAGE_JSON_PATH)?.dependencies ?? {};
    const shared = {};
    Object.keys(dependencies).forEach(dep => {
        shared[dep] = ({
            import: dep,
            requiredVersion: dependencies[dep],
            singleton: DEFAULT_SINGLETON.includes(dep)
        });
    });
    return shared;
}