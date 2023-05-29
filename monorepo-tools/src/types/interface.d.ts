type FilePath = string;

export interface IOptions {
    unify: boolean | number; // 是否以单个端口模式启动，为number时候为指定端口号
    prod: boolean; // 是否以生产模式启动，便于调试线上环境异常，由于生产模式启用content hash，所以默认关闭热更新
    project: string;// 指定启动项目列表，可仅启动指定项目，其余项目采用线上的远端模块地址
    config: string; // 配置项
    env: string; // 当前环境，启动默认为DEV，构建默认为PROD，如果以生产模式启动，则默认为PROD
}

export interface IConfig {
    rootDir: string | any; // rootDir为字符串类型值，与IProject描述，为避免冲突，添加｜any

    [projectName: string]: IProject;
}

export interface IProject {
    root?: boolean; // 是否为根项目，仅在unify启动或者构建模式下有效，该项目的目录层级会提升
    webpack?: FilePath;// 自定义webpack配置文件
    deployUrl?: string; // 项目部署地址
    entry?: string; // 项目入口地址
    options?: {
        lessOptions?: object;// lessOptions配置
    };
}