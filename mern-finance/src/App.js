import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import ExercisesList from "./components/exercises-list.component";

function App() {
  return (
    <Router>
       <div>
      <br/>
      <Route path="/" exact component={ExercisesList} />
    
      </div>
    </Router>
  );
}

export default App;
