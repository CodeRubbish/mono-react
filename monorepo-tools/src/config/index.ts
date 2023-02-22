import {commonConfig as commonConfigDEV} from "./dev/common";
import {commonConfig as commonConfigPRO} from "./production/common";

export const getCommonCfg = (dev) => dev ? commonConfigDEV : commonConfigPRO;