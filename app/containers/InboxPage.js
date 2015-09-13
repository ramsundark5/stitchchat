import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import ThreadList from '../components/threads/ThreadList';
import ThreadComposer from '../components/threads/ThreadComposer';
import * as ThreadActions from '../actions/ThreadActions';
import {commons} from '../styles/Styles';

class InboxPage extends Component {

    _renderMediaOptions(isEditing, router){
        //don't show media options in editing state
        if(isEditing){
            return;
        }
        return(
            <MediaOptions router={router}/>
        );
    }

    render() {
        const { threads, dispatch, isEditing, router } = this.props;
        const actions = bindActionCreators(ThreadActions, dispatch);

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <ThreadList threads={threads} isEditing={isEditing} actions={actions} router={router}/>
                </View>
                <View style={[{flex: 0}, commons.horizontalNoWrap]}>
                        <ThreadComposer addThread={actions.addThread} isEditing={isEditing} actions={actions}/>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        threads: state.threads,
        isEditing: state.isEditing
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    }
});
export default connect(mapStateToProps)(InboxPage);
