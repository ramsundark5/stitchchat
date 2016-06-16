import App from './app/containers/App';
import { AppRegistry } from 'react-native';
import React, {Component} from 'react';

class stitchchat extends Component {

    render() {
        return(
            <App />
        );
    }
}

AppRegistry.registerComponent('stitchchat', () => stitchchat);
