import React from "react";
import {add, tt} from "utils/add";
import './test.less';
import RemoteButton from "base/remoteButton";

const App = () => {
    return <>
        <div className={'cc'}>other app{add(2, 5)}{tt(10, 8)}</div>
        <RemoteButton></RemoteButton>
    </>;
};
export default App;