import React, {Component, PropTypes} from 'react';
import {View, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Theme} from '../common/Themes';
import MessageService from '../../services/MessageService';

class MessageOptionsBox extends Component {

    copyMessages(){
        MessageService.copyMessages();
    }

    deleteSelected(){
        MessageService.deleteSelectedMessages();
    }
    
    render() {
        return (
            <View style={[styles.msgOptions]}>
                <TouchableHighlight style={[styles.defaultIconContainer]}
                                    onPress={() => this.copyMessages()}>
                    <Icon name='ios-copy'
                          style={styles.defaultIcon}/>
                </TouchableHighlight>
                <TouchableHighlight style={styles.defaultIconContainer}
                                    onPress={()=> this.deleteSelected()}>
                    <Icon name='ios-trash'
                          style={styles.defaultIcon}/>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultIconContainer:{
    },
    defaultIcon: {
        // padding: 4,
        fontSize : 30,
        color: Theme.iconColor
    },
    msgOptions:{
        flexDirection : 'row',
        flexWrap      : 'nowrap',
        justifyContent: 'space-around',
    },
});

MessageOptionsBox.propTypes = {
    copySelectedMessages: PropTypes.func.isRequired,
    deleteSelected: PropTypes.func.isRequired
};

export default MessageOptionsBox;
