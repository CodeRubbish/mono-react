import commonConfigDEV from "./dev/common";
import commonConfigPRO from "./production/common";

export const getCommonCfg = (isProd) => isProd ? commonConfigPRO : commonConfigDEV;