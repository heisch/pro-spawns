import React, { Component } from 'react';
import {spawnDataParser} from "./providers/spawnDataParser";

class App extends Component {
  render() {
    let flupp = new spawnDataParser();

    console.log(flupp.getSourceData());
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
