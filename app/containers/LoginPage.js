import LoginService from '../services/LoginService';
import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';

export default class LoginPage extends Component{

    componentDidMount(){
        LoginService.showLoginPage();
    }

    render() {
        return (<View></View>);
    }
}