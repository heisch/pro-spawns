import React, {Component} from 'react';
import Settings from "../containers/Settings";
import QuickList from "../containers/QuickList";
import '../resources/css/App.css';
import '../resources/css/pokdex_sprites.css';
import '../resources/css/TypeEffectivenessMatrixModal.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Settings/>
                <QuickList/>
            </div>
        );
    }
}

export default App;
