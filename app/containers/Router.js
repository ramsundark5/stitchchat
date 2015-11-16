import React, { Navigator } from 'react-native';
import InboxPage from './InboxPage';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';
import ContactsPage from './ContactsPage';
import CreateGroupsPage from './CreateGroupsPage';
import MediaGallery from '../components/media/MediaGallery';
import NavigationBar from '../components/navbar/NavigationBar';
import CreateGroupNavBar from '../components/contacts/NewContactGroupHeader';

class Router {
    constructor(navigator) {
        this.navigator = navigator;
    }

    push(props, route) {
        let routesList = this.navigator.getCurrentRoutes();
        let nextIndex = routesList[routesList.length - 1].index + 1;
        route.props = props;
        route.index = nextIndex;
        this.navigator.push(route);
    }

    pop() {
        this.navigator.pop();
    }

    toLoginView(props) {
        this.push(props, {
            component: LoginPage,
            name: 'loginView',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Login', }}/>
            )
        })
    }

    toInboxView(props) {
        this.push(props, {
            component: InboxPage,
            name: 'inboxView',
            sceneConfig: Navigator.SceneConfigs.FloatFromLeft,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Inbox'}}/>
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
                    title={{ title: props.displayName }}
                    leftButton={{ title: 'Back', handler: () => this.replaceWithHome()}}/>
            )
        })
    }

    toMediaGalleryView(props) {
        this.push(props, {
            component: MediaGallery,
            name: 'galleryView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        })
    }

    toContactsView(props) {
        this.push(props, {
            component: ContactsPage,
            name: 'contactsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Contacts', }}
                    leftButton={{ title: 'Cancel', handler: () => this.pop()}}/>
            )
        })
    }

    toCreateGroupsView(props) {
        this.push(props, {
            component: CreateGroupsPage,
            name: 'createGroupsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom
        })
    }

    replaceWithHome() {
        this.navigator.popToTop();
        /*let homeRoute = {
            name: 'inboxView',
            index: 0,
            component: InboxPage,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Inbox'}}/>
            )
        }
        this.navigator.replace(homeRoute);*/
    }

}

export default Router;
