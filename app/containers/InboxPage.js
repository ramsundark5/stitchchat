import React from 'react';
import {View, Text, TouchableHighlight, Platform, StyleSheet, InteractionManager} from 'react-native';
import Component from '../components/PureComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ThreadList from '../components/threads/ThreadList';
import ThreadComposer from '../components/threads/ThreadComposer';
import ThreadOptionsBox from '../components/threads/ThreadOptionsBox';
import * as ThreadActions from '../actions/ThreadActions';
import {Theme} from '../components/common/Themes';
import LoginService from '../services/LoginService';
import ThreadDao from '../dao/ThreadDao';
import ProfileService from '../services/ProfileService';
import ContactsManger from '../services/ContactsManger';
import PushNotification from 'react-native-push-notification';

class InboxPage extends Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        this.loadRecentThreads();
        this.showLoginPageIfRequired();
        InteractionManager.runAfterInteractions(() => {
            this.props.threadActions.setCurrentThread(null);
            ContactsManger.syncContacts();
            PushNotification.setApplicationIconBadgeNumber(0);
        });
    }

    loadRecentThreads(){
        let recentThreads = ThreadDao.loadRecentThreads();
        this.props.threadActions.loadRecentThreads(recentThreads);
    }

    render() {
        const { threads, threadActions, isEditing, router } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <ThreadList threads={threads}
                                loadMoreThreads={threadActions.loadMoreThreads}
                                selectThread={threadActions.selectThread}
                                setCurrentThread={threadActions.setCurrentThread}
                                isEditing={isEditing}
                                router={router}/>
                    {this.renderThreadComposer(isEditing, threadActions, router)}
                </View>
                <View style={{flex: 0}}>
                    {this.renderRemindRegistration()}
                    {this.renderThreadOptionsBox(isEditing, threadActions.deleteSelected)}
                </View>
            </View>
        );
    }

    renderThreadComposer(isEditing, threadActions, router){
        if(isEditing){
            return;
        }else{
            return(
                <ThreadComposer addNewThread={threadActions.addNewThread}
                                addNewGroupThread={threadActions.addNewGroupThread}
                                searchThreads={threadActions.searchThreads}
                                isEditing={isEditing}
                                router={router}/>
            );
        }
    }

    renderThreadOptionsBox(isEditing, deleteSelected){
        if(!isEditing){
            return;
        }else{
            return(
                <ThreadOptionsBox isEditing={isEditing} deleteSelected={deleteSelected}/>
            );
        }
    }

    renderRemindRegistration(){
        let currentOS = Platform.OS;
        if(currentOS == 'ios' && this.props.allowUnregistered) {
            return(
                <TouchableHighlight
                    onPress={() => {this.props.router.pop()} }
                    style={styles.remindRegisterButton}>
                        <Text style={styles.remindRegisterButtonText}>
                            Register me!
                        </Text>
                </TouchableHighlight>
            );
        }
        else{
            return;
        }
    }

     showLoginPageIfRequired(){
        let isRegistered = ProfileService.isAppRegistered();
        if(!isRegistered){
            if(Platform.OS != 'ios') {
                LoginService.authenticateWithDigits();
            }else if(!this.props.allowUnregistered){
                this.props.router.toLoginView({});
            }
        }
     }

    renderTempLoginUtil(){
        return(
            <View>
                <TouchableHighlight onPress={() => this.showLoginPage()}>
                    <Text>Login</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableHighlight>
            </View>
        );
    }

    showLoginPage(){
        LoginService.authenticateWithDigits();
    }

    logout(){
        LoginService.logout();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor: '#FAFAFA',
    },
    listContainer: {
        flex: 1,
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
        fontSize: 14
    },
});

function mapStateToProps(state) {
    return {
        threads: state.threadState.threads,
        isEditing: state.threadState.isEditing
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(InboxPage);
