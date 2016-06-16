import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MessageComposer from '../components/messages/MessageComposer';
import MediaOptions from '../components/media/MediaOptions';

class MessagePageFooter extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render(){
        const { messageActions, isEditing, isMediaOptionsVisible, currentThread, router } = this.props;
        return(
            <View style={[styles.horizontalNoWrap, styles.messageComposer]}>
                {this._renderMediaOptions(isEditing, isMediaOptionsVisible, messageActions, router)}
                <View style={{flex: 1}}>
                    <MessageComposer isEditing={isEditing}
                                     currentThread={currentThread}
                                     actions={messageActions}/>
                </View>
            </View>
        );
    }

    _renderMediaOptions(isEditing, isMediaOptionsVisible, messageActions, router){
        //don't show media options in editing state
        if(isEditing){
            return;
        }
        return(
            <MediaOptions router={router} isMediaOptionsVisible={isMediaOptionsVisible}
                          showMediaOptions={messageActions.showMediaOptions}
                          hideMediaOptions={messageActions.hideMediaOptions}/>
        );
    }
}

const styles = StyleSheet.create({
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    messageComposer:{
        backgroundColor: '#FAFAFA',
        paddingTop: 5,
    },
});

MessagePageFooter.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isMediaOptionsVisible: PropTypes.bool.isRequired,
    currentThread: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

export default MessagePageFooter;
