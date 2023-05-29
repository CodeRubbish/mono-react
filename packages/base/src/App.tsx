import React from "react";
import {add, tt} from "utils/add";
import './test.less';
import OtherButton from 'app/otherButton';
import {Button,Pagination} from "antd";

console.log('ENV', __DEV__);
const App = () => {
    return <>
        <div className={'cc'}>Base App{add(2, 5)}{tt(10, 8)}</div>
        <OtherButton></OtherButton>
        <Button type={"primary"}>antd Button</Button>
        <Pagination>test</Pagination>
    </>;
};
export default App;