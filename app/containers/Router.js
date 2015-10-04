import React, { Navigator } from 'react-native';
import InboxPage from './InboxPage';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';
import PhotoGallery from '../components/media/PhotoGallery';
import NavigationBar from 'react-native-navbar';
import {navStyle} from '../styles/NavBarStyles';

class Router {
    constructor(navigator) {
        this.navigator = navigator
    }

    push(props, route) {
        let routesList = this.navigator.getCurrentRoutes()
        let nextIndex = routesList[routesList.length - 1].index + 1
        route.props = props
        route.index = nextIndex
        this.navigator.push(route)
    }

    pop() {
        this.navigator.pop()
    }

    toLoginView(props) {
        this.push(props, {
            component: LoginPage,
            name: 'loginview',
            sceneStyle: navStyle.opaqueSceneStyle,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Inbox'
                    hidePrev = {true}
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    toInboxView(props) {
        this.push(props, {
            component: InboxPage,
            name: 'inboxview',
            sceneStyle: navStyle.opaqueSceneStyle,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Inbox'
                    hidePrev = {true}
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    toMessageView(props) {
        this.push(props, {
            component: MessagePage,
            name: 'messageview',
            sceneStyle: navStyle.opaqueSceneStyle,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Gallery'
                    prevTitle = 'Back'
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    toPhotoGalleryView(props) {
        this.push(props, {
            component: PhotoGallery,
            name: 'galleryview',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title='Gallery'
                    prevTitle = 'Done'
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    replaceWithHome() {
        this.navigator.popToTop()
    }

}

module.exports = Router
