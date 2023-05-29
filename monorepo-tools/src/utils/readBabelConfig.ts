import path from "path";
import Project from "../project";
import {findFile} from "./findFile";

const BABEL_CONFIG_FILE = ['.babelrc', 'babel.config.js',];

export function readBabelConfig(project: Project) {
    return findFile(...BABEL_CONFIG_FILE.map(file => path.join(project.projectRootPath, file)));
}