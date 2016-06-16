import LoginService from '../services/LoginService';
import React, {Component} from 'react';
import {View, TouchableHighlight, Text, StyleSheet, Linking} from 'react-native';
import {Theme} from '../components/common/Themes';

export default class LoginPage extends Component{

    showLoginPage(){
        let loginPromise = LoginService.authenticateWithDigits();
        loginPromise.then(this.gotoInboxPageAfterRegister.bind(this));
    }

    gotoInboxPageAfterRegister(){
        this.props.router.replaceWithHome();
    }

    gotoInboxPageBeforeRegister(){
        this.props.router.toInboxView({allowUnregistered: true});
    }

    openTermsURL(){
        Linking.openURL('https://ramsundark5.github.io/stitchchat-website/eula.html')
            .catch(err => console.error('An error occurred opening terms url', err));
    }

    openPrivacyURL(){
        Linking.openURL('https://ramsundark5.github.io/stitchchat-website/privacy.html')
            .catch(err => console.error('An error occurred opening privacy url', err));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <TouchableHighlight
                        onPress={() => {this.showLoginPage()} }
                        style={styles.remindRegisterButton}>
                        <Text style={styles.remindRegisterButtonText}>
                            Register Phone
                        </Text>
                    </TouchableHighlight>
                    <View style={[styles.termsPolicy]}>
                            <Text style={styles.termsText}>By clicking Register, you agree to the
                                <Text style={styles.link} onPress={this.openTermsURL}> Terms of use </Text>
                                and you acknowledge that you have read the
                                <Text style={styles.link} onPress={this.openPrivacyURL}> Privacy policy </Text>
                             </Text>
                     </View>
                </View>
                <View style={[styles.skipRegistration]}>
                    <Text style={styles.skipRegistrationText} onPress={() => {this.gotoInboxPageBeforeRegister()}}>
                        Skip Registration
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remindRegisterButton:{
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 7,
        height: 40,
    },
    remindRegisterButtonText:{
        color: Theme.defaultTextColor,
        fontSize: 14,
        padding: 4
    },
    termsPolicy:{
        margin: 20,
    },
    termsText:{
        fontSize:10,
        color: 'grey'
    },
    link:{
        color: '#0000ff',
        fontSize:10,
    },
    skipRegistration:{
        bottom: 30,
    },
    skipRegistrationText:{
        color: Theme.primaryColor,
        fontSize:10,
        marginLeft: 10
    },
});