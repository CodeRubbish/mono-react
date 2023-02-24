import React from "react";
import {add, tt} from "utils/add";
import './test.less';

const App = () => {
    return <div className={'cc'}>Base App{add(2, 5)}{tt(10, 8)}</div>;
};
export default App;