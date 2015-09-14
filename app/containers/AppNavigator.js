import React, { Component, View, Navigator, PropTypes } from 'react-native';
import MessagePage from '../containers/MessagePage';
import InboxPage from '../containers/InboxPage';
import Router from './Router';
import NavigationBar from 'react-native-navbar';
import {navStyle} from '../styles/NavBarStyles';

class AppNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.initialRoute = {
            name: 'inboxview',
            index: 0,
            component: InboxPage,
            navigationBar: (
                <NavigationBar
                    title = 'Inbox'
                    hidePrev = {true}
                    style = {navStyle.navBarContainer}
                    />
            )
        }
    }

    renderScene(route, navigator) {
        this.router = this.router || new Router(navigator);
        const Component = route.component;
        let navBar = route.navigationBar;

        if (navBar) {
            navBar = React.addons.cloneWithProps(navBar, {
                navigator, route,
            });
        }

        if (route.component) {
            let propsOverride = Object.assign({}, route.props, {
                                    ref: view=>this[route.name] = view,
                                    router: this.router
                                });
            return (
                <View style={{ flex: 1 }}>
                    {navBar}
                    <Component {...propsOverride}/>
                </View>
            );
        }
    }

    configureScene(route) {
        if (route.sceneConfig) {
            return route.sceneConfig;
        }
        return Navigator.SceneConfigs.FloatFromRight;
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

