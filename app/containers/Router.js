import React, { Navigator } from 'react-native';
import InboxPage from './InboxPage';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';
import ContactsPage from './ContactsPage';
import CreateGroupsPage from './CreateGroupsPage';
import CreateGroupButton from '../components/navbar/NavigationBar';
import PhotoGallery from '../components/media/PhotoGallery';
import NavigationBar from '../components/navbar/NavigationBar';
import {navbarStyle} from '../components/navbar/NavBarStyles';

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
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Login'
                    hidePrev = {true}
                    style= {navbarStyle.navBarContainer}/>
            )
        })
    }

    toInboxView(props) {
        this.push(props, {
            component: InboxPage,
            name: 'inboxView',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Inbox'
                    hidePrev = {true}
                    style= {navbarStyle.navBarContainer}/>
            )
        })
    }

    toMessageView(props) {
        this.push(props, {
            component: MessagePage,
            name: 'messageView',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Gallery'
                    prevTitle = 'Back'
                    style= {navbarStyle.navBarContainer}/>
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
                    style= {navbarStyle.navBarContainer}/>
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
                    style= {navbarStyle.navBarContainer}/>
            )
        })
    }

    toCreateGroupsView(props) {
        this.push(props, {
            component: CreateGroupsPage,
            name: 'createGroupsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title='New Group'
                    prevTitle='Cancel'
                    customNext={<CreateGroupButton/>}
                    style= {navbarStyle.navBarContainer}/>
            )
        })
    }

    replaceWithHome() {
        this.navigator.popToTop()
    }

}

module.exports = Router
