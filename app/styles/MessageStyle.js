import { StyleSheet } from 'react-native';
import {defaultStyle, commons} from './Styles'
const senderMessageBgColor     = '#257DF7';
const receiverMessageBgColor   = '#D1D1D1';
const senderMessageTextColor   = '#FFFFFF';
const receiverMessageTextColor = '#000000';
const selectedColor            = '#ff0000';
export const messageStyle = StyleSheet.create({
    messageListContainer: {
        flex: 1,
    },
    msgItemContainer: {  // F. hack. Can't align multiple items to right, I need to nest them inside a parent.
        flex: 1,
        flexDirection: 'column',
        marginBottom: 20,
    },
    msgItem: {
        paddingTop: 8,
        flexDirection: 'column',
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 15,
    },
    msgItemSender: {
        marginRight: 10, // Offset for the image
        marginLeft: 35,
        backgroundColor: senderMessageBgColor,
    },
    msgItemReceiver: {
        marginRight: 35, // Offset for the image
        marginLeft: 10,
        backgroundColor: receiverMessageBgColor,
    },
    msgSentText: {
        fontSize: 14,
        color: senderMessageTextColor,
    },
    msgReceivedText: {
        fontSize: 14,
        color: receiverMessageTextColor,
    },
    msgImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    msgImageBefore: {
        position: 'absolute',
        top: 2,
        left: 3,
    },
    msgImageAfter: {
        position: 'absolute',
        top: 2,
        right: 3,
    },
    msgSelected: {
        backgroundColor: selectedColor,
    },
    msgUnselected: {
        backgroundColor: 'transparent',
    },
    msgDivider:{
        alignSelf: 'center',
        backgroundColor: 'green',
        marginBottom: 5
    }
});