import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import FinanceList from "./components/finance-list.component";

function App() {
  return (
    <Router>
       <div>
      <br/>
      <Route path="/" exact component={FinanceList} />
    
      </div>
    </Router>
  );
}

export default App;
