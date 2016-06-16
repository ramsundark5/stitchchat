import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Status from '../../constants/AppConstants';
import moment from 'moment';

class MessageStatusIcon extends Component {

    getStatusIcon(msgStatus){
        let statusIconName = 'md-sync';
        if(msgStatus === Status.STATUS_SENT){
            statusIconName = 'md-checkmark';
        }
        else if(msgStatus === Status.STATUS_RECEIVED){
            statusIconName = 'md-done-all';
        }
        return statusIconName;
    }

    render() {
        const {message} = this.props;
        const statusColor = message.isOwner? styles.senderStatusColor : styles.receiverStatusColor;
        const statusTime   = moment(message.timestamp).format("hh:mm a");
        return(
            <View style={[styles.horizontalNoWrap, styles.pullRight]}>
                <Text style={[styles.smallText, statusColor]}>{statusTime}</Text>
                {this.renderStatusIcon(message, statusColor)}
            </View>
        );
    }

    renderStatusIcon(message, statusColor){
        const statusIcon   = this.getStatusIcon(message.status);
        if(message.isOwner){
            return(
                <Icon name={statusIcon}
                      style={[styles.smallIcon, statusColor]}/>
            );
        }
        return null;
    }

}

const styles = StyleSheet.create({
    senderStatusColor: {
        color: 'black',
    },
    receiverStatusColor: {
        color: '#9c9393',
    },
    smallIcon: {
        width : 16,
        height: 16,
    },
    pullRight:{
        alignSelf: 'flex-end',
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    smallText: {
        fontSize: 11,
        paddingRight: 4,
        fontStyle: 'italic',
    },
});

MessageStatusIcon.propTypes = {
    message: PropTypes.object.isRequired,
};

export default MessageStatusIcon;
