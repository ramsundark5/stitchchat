import {Component} from 'react';
import {View, Navigator} from 'react-native';
import React from 'react';
import InboxPage from '../containers/InboxPage';
import Router from './Router';
import NavigationBar from '../components/navbar/NavigationBar';
import AppInitService from '../services/AppInitService';

class AppNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.initialRoute = {
            name: 'inboxView',
            index: 0,
            component: InboxPage,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Inbox'}}/>
            )
        };
        AppInitService.init();
    }

    renderScene(route, navigator) {
        this.router = this.router || new Router(navigator);
        const Component = route.component;
        let navBar = route.navigationBar;

        if (navBar) {
            navBar = React.cloneElement(navBar, {
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
                renderScene={(route, navigator) => this.renderScene(route, navigator)}
                configureScene={(route) => this.configureScene(route)}
                />
        );
    }
}

export default AppNavigator;

