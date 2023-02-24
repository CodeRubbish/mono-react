import React from "react";
import {add,tt} from "utils/add";

const App = () => {
    return <div>Base App{add(2, 5)}{tt(10, 8)}</div>;
};
export default App;