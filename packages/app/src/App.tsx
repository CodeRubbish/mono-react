import React from "react";
import {add, tt} from "utils/add";
import RemoteButton from "base/remoteButton";
import './test.module.css';

const App = () => {
    return <>
        <div className={'cc'} styleName={'mm'}>other app{add(2, 5)}{tt(10, 8)}</div>
        <RemoteButton></RemoteButton>
    </>;
};
export default App;