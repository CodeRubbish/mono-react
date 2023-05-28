import scanProject from "./scanProject";
import log from "./log";
import process from "process";

/**
 * 解析本次使用的项目
 */
export function resolveUseProjects(project, rootPath, serveConfig) {
    const projects = scanProject(rootPath, serveConfig);
    let useProjects = projects;// 默认构建所有项目
    // project 存在说明用户指定了字段，使用用户指定项目
    if (project) {
        const userProjects = project.split(/[,\s]/);// 用户指定了构建项目
        useProjects = [];
        userProjects.forEach(projectName => {
            const matchProject = projects.find(_ => _.name === projectName);
            if (!matchProject) return log.warn(`the project ${projectName} does not exist`);
            useProjects.push(matchProject);
        });
    }
    if (useProjects.length === 0) {
        log.error('there are no project to build,please make sure you have any project or specify the right project name');
        process.exit(2);
    }
    return {useProjects, projects};
}