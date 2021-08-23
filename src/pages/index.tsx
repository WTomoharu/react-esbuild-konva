import React from "react";
import ReactDOM from "react-dom";

import KonvaTable from "../components/KonvaTable/";

const App = () => {
  return (
    <KonvaTable />
  )
}

ReactDOM.render(<App />, document.getElementById("root"))