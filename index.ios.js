import regenerator from 'regenerator/runtime';
import React from 'react-native';
import App from './app/containers/App';

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    } = React;

var stitchchat = React.createClass({
    render: function () {
        return (
            <App />
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('stitchchat', () => stitchchat);
