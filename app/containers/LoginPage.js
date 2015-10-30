import LoginService from '../services/LoginService';
import {commons, defaultStyle} from '../components/styles/CommonStyles';
import React, { Component, View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class LoginPage extends Component{

    showLoginPage(){
        LoginService.showLoginPage();
    }

    render() {
        return (
            <TouchableHighlight style={commons.center} onPress={() => this.showLoginPage()}>
                <Icon name='ios-people-outline'
                      style={commons.defaultIcon}/>
            </TouchableHighlight>
        );
    }
}