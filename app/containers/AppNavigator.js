import React, { Component, View, Navigator, PropTypes } from 'react-native';
import MessagePage from '../containers/MessagePage';
import Router from './Router';

class AppNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.initialRoute = {
            name: 'messageview',
            index: 0,
            component: MessagePage
        }
    }

    renderScene(route, navigator) {
        this.router = this.router || new Router(navigator)
        if (route.component) {
            return React.createElement(route.component, Object.assign({}, route.props,
                {
                    ref: view=>this[route.name] = view,
                    router: this.router
                }
            ))
        }
    }

    configureScene(route) {
        if (route.sceneConfig) {
            return route.sceneConfig
        }
        return Navigator.SceneConfigs.FloatFromRight
    }

    render() {
        return (
            <Navigator
                ref={view => this.navigator=view}
                initialRoute={this.initialRoute}
                renderScene={this.renderScene.bind(this)}
                configureScene={this.configureScene.bind(this)}
                />
        );
    }
}

export default AppNavigator;

