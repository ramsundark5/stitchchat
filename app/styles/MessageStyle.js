import { StyleSheet } from 'react-native';

const senderMessageBgColor     = '#257DF7';
const receiverMessageBgColor   = '#D1D1D1';
const senderMessageTextColor   = '#FFFFFF';
const receiverMessageTextColor = '#000000';
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
        margin: 15, // Offset for the image
        padding: 10,
        borderRadius: 15,
    },
    msgItemSender: {
        backgroundColor: senderMessageBgColor,
    },
    msgItemReceiver: {
        backgroundColor: receiverMessageBgColor,
    },
    msgSentText: {
        fontSize: 14,
        color: senderMessageTextColor,
    },
    msgReceivedText: {
        fontSize: 14,
        color: receiverMessageBgColor,
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
    }
});