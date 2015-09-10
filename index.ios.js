import App from './app/containers/App';
import React, { Component, AppRegistry, PropTypes } from 'react-native';

class stitchchat extends Component {

    render() {
        return(
            <App />
        );
    }
}

AppRegistry.registerComponent('stitchchat', () => stitchchat);
