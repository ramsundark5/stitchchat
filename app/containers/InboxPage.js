import React, { Component, View, Text, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import ThreadList from '../components/threads/ThreadList';
import ThreadComposer from '../components/threads/ThreadComposer';
import * as ThreadActions from '../actions/ThreadActions';
import * as MessageActions from '../actions/MessageActions';
import {commons} from '../components/styles/CommonStyles';
import LoginService from '../services/LoginService';
import ThreadDao from '../dao/ThreadDao';
import CacheService from '../services/CacheService';
import Button from 'apsl-react-native-button'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class InboxPage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isRegistered: true
        };
        this.loadRecentThreads();
        RCTDeviceEventEmitter.addListener('registrationSuccess', this.onRegistrationSuccess.bind(this));
    }

    componentWillMount(){
        this.showLoginPageIfRequired();
    }

    async loadRecentThreads(){
        let recentThreads = await ThreadDao.loadRecentThreads();
        debugAsyncObject(recentThreads);
        this.props.threadActions.loadRecentThreads(recentThreads);
    }

    render() {
        const { threads, threadActions, messageActions, isEditing, router } = this.props;

        return (
            <View style={commons.container}>
                <View style={{flex: 1}}>
                    <ThreadList threads={threads}
                                loadMoreThreads={threadActions.loadMoreThreads}
                                selectThread={threadActions.selectThread}
                                setCurrentThread={threadActions.setCurrentThread}
                                loadMessagesForThread={messageActions.loadMessagesForThread}
                                isEditing={isEditing}
                                router={router}/>
                </View>
                {this.renderRemindRegistration()}
                <View style={[{flex: 0}, commons.horizontalNoWrap]}>
                    <ThreadComposer addNewThread={threadActions.addNewThread}
                                    addNewGroupThread={threadActions.addNewGroupThread}
                                    searchThreads={threadActions.searchThreads}
                                    isEditing={isEditing}
                                    router={router}/>
                </View>
            </View>
        );
    }

    renderRemindRegistration(){
        let isRegistered = this.state.isRegistered;
        let currentOS = Platform.OS;
        if(currentOS == 'ios' && !isRegistered) {
            return(
                <Button
                    style={commons.remindRegisterButton} textStyle={commons.defaultText}
                    onPress={() => {LoginService.showLoginPage();} }>
                    Click here to Register!
                </Button>
            );
        }
        else{
            return;
        }
    }

    async showLoginPageIfRequired(){
        let isRegistered = await CacheService.isAppRegistered();
        if(!isRegistered){
            LoginService.showLoginPage();
        }
        this.setState({isRegistered: isRegistered});
    }

    onRegistrationSuccess(){
        let currentOS = Platform.OS;
        this.setState({isRegistered: true});
        console.log("registration success in invoked and status updated");
        if(currentOS == 'ios') {
            this.forceUpdate();
        }
    }

}

function mapStateToProps(state) {
    return {
        threads: state.threadState.threads,
        isEditing: state.threadState.isEditing
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        messageActions: bindActionCreators(MessageActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(InboxPage);
