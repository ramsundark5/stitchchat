import React, { Navigator } from 'react-native';
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

    toMessageView(props) {
        this.push(props, {
            component: MessagePage,
            name: 'messageview',
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            navigationBar: (
                <NavigationBar
                    title='Gallery'
                    prevTitle = 'Done'
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
