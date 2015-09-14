import App from './app/containers/App';
import React, { Component, AppRegistry, PropTypes } from 'react-native';
require('regenerator/runtime');

class stitchchat extends Component {

  render() {
    return(
        <App />
    );
  }
}

AppRegistry.registerComponent('stitchchat', () => stitchchat);
