import React, { Navigator } from 'react-native';
import InboxPage from './InboxPage';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';
import ContactsPage from './ContactsPage';
import PhotoGallery from '../components/media/PhotoGallery';
import NavigationBar from 'react-native-navbar';
import {navStyle} from '../components/styles/NavBarStyles';

class Router {
    constructor(navigator) {
        this.navigator = navigator
    }

    push(props, route) {
        let routesList = this.navigator.getCurrentRoutes();
        let nextIndex = routesList[routesList.length - 1].index + 1;
        route.props = props;
        route.index = nextIndex;
        this.navigator.push(route);
    }

    pop() {
        this.navigator.pop()
    }

    toLoginView(props) {
        this.push(props, {
            component: LoginPage,
            name: 'loginView',
            sceneStyle: navStyle.opaqueSceneStyle,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Login'
                    hidePrev = {true}
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    toInboxView(props) {
        this.push(props, {
            component: InboxPage,
            name: 'inboxView',
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
            name: 'messageView',
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
            name: 'galleryView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title='Gallery'
                    prevTitle = 'Done'
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    toContactsView(props) {
        this.push(props, {
            component: ContactsPage,
            name: 'contactsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title='Contacts'
                    prevTitle = 'cancel'
                    style= {navStyle.navBarContainer}/>
            )
        })
    }

    replaceWithHome() {
        this.navigator.popToTop()
    }

}

module.exports = Router
