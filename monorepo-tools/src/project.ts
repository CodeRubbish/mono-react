/**
 * 项目具有两种类型：
 * 应用：应用具有index.html，是可以直接使用的。
 * 库：库只能被应用使用，无法单独使用
 */
enum ProjectType {
    Application,
    Library,
}

export default class Project {
    type: ProjectType; // 项目类型
    name: string; // 项目名称
    entry: string; // 项目的入口文件
    constructor(name, entry) {
        this.name = name;
        this.entry = entry;
    }

    isApplication() {
        return this.type === ProjectType.Application;
    }

    isLibrary() {
        return this.type === ProjectType.Library;
    }
}

export class AppProject extends Project {
    type = ProjectType.Application;
    htmlTemplate: string; // 应用的Html模板
    constructor(name, entry, htmlTemplate) {
        super(name, entry);
        this.htmlTemplate = htmlTemplate;
    }
}

export class LibProject extends Project {
    type = ProjectType.Library;
}