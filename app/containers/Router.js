import React from 'react';
import {Navigator} from 'react-native';
import InboxPage from './InboxPage';
import LoginPage from './LoginPage';
import MessagePage from './MessagePage';
import ContactsPage from './ContactsPage';
import InviteContactsPage from './InviteContactsPage';
import CreateGroupsPage from './CreateGroupsPage';
import MediaGallery from '../components/media/MediaGallery';
import MediaViewer from '../components/media/MediaViewer';
import NavigationBar from '../components/navbar/NavigationBar';
import CreateGroupNavBar from '../components/contacts/NewContactGroupHeader';

class Router {
    constructor(navigator) {
        this.navigator = navigator;
    }

    push(props, route) {
        if(!props){
            props = {};
        }
        route.props = props;
        this.navigator.push(route);
    }

    replace(props, route){
        if(!props){
            props = {};
        }
        route.props = props;
        this.navigator.replace(route);
    }

    pop() {
        this.navigator.pop();
    }

    toLoginView(props) {
        this.push(props, {
            component: LoginPage,
            name: 'loginView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Stitchchat', }}/>
            )
        });
    }

    toInboxView(props) {
        this.push(props, {
            component: InboxPage,
            name: 'inboxView',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Inbox'}}/>
            )
        });
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
        });
    }

    toContactsView(props) {
        this.push(props, {
            component: ContactsPage,
            name: 'contactsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: '', }}
                    leftButton={{ title: 'Cancel', handler: () => this.pop()}}
                    rightButton={{ title: 'Invite', handler: () => this.toInviteContactsView()}}/>
            )
        });
    }

    toInviteContactsView(props){
        this.push(props, {
            component: InviteContactsPage,
            name: 'inviteContactsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Invite', }}
                    leftButton={{ title: 'Cancel', handler: () => this.pop()}}/>
            )
        });
    }

    toCreateGroupsView(props) {
        this.push(props, {
            component: CreateGroupsPage,
            name: 'createGroupsView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom
        });
    }

    toMediaViewer(props){
        this.push(props, {
            component: MediaViewer,
            name: 'mediaViewer',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        });
    }

    toMediaGalleryView(props) {
        this.push(props, {
            component: MediaGallery,
            name: 'galleryView',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Gallery', }}
                    leftButton={{ title: 'Close', handler: () => this.pop()}}/>
            )
        });
    }

    toGalleryViewFromMediaViewer(props) {
        this.replace(props, {
            component: MediaGallery,
            name: 'galleryView2',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            navigationBar: (
                <NavigationBar
                    title={{ title: 'Gallery', }}
                    leftButton={{ title: 'Close', handler: () => this.pop()}}/>
            )
        });
    }

    replaceWithHome() {
        //this.navigator.popToTop();
        this.toInboxView({});
    }

}

export default Router;
