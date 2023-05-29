import log from "./utils/log";

/**
 * 项目具有两种类型：
 * 应用：应用具有index.html，是可以直接使用的。
 * 库：库只能被应用使用，无法单独使用
 */
enum ProjectType {
    Application,
    Library,
}

const WARN_KEYS = ['type', 'name', 'entry', 'projectRootPath', 'alias'];
export default class Project {
    type: ProjectType; // 项目类型
    name: string; // 项目名称
    entry: string; // 项目的入口文件
    projectRootPath: string; // 项目根路径
    alias: Record<string, string>; // 项目其余目录别名
    [prop: string]: any;

    constructor(name, entry, projectRootPath, alias, options?) {
        this.name = name;
        this.entry = entry;
        this.alias = alias;
        this.projectRootPath = projectRootPath;
        if (options) {
            Object.keys(options).forEach(key => {
                if (WARN_KEYS.includes(key)) {
                    log.warn(`your config option should not include key ${key},it will not work because it will conflict with internal key `);
                    return;
                }
                this[key] = options[key];
            });
        }
    }

    isApplication(): this is AppProject {
        return this.type === ProjectType.Application;
    }

    isLibrary(): this is LibProject {
        return this.type === ProjectType.Library;
    }
}

export class AppProject extends Project {
    type = ProjectType.Application;
    htmlTemplate: string; // 应用的Html模板
    root = false;// 默认非根应用

    constructor(name, entry, projectRootPath, alias, htmlTemplate, options?) {
        super(name, entry, projectRootPath, alias, options);
        this.htmlTemplate = htmlTemplate;
    }

    isRoot(): boolean {
        return this.root;
    }
}

export class LibProject extends Project {
    type = ProjectType.Library;
}