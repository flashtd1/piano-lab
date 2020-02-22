import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom'
import Sheet from './views/sheet';
import PianoPage from './views/piano';



function App() {
  return (
    <HashRouter className="App">
      <Switch>
        <Route path="/" exact component={PianoPage} />
        <Route path="/sheet-lab" exact component={Sheet} />
      </Switch>
    </HashRouter>
  );
}

export default App;
