import { StyleSheet } from 'react-native';

export const defaultFontSize    = 14;
export const defaultTextInputHeight = 26;
export const bgColor     = '';
export const headerColor = '';
export const defaultIconColor   = '#333333';
export const defaultIconSize    = 30;

export const commons = StyleSheet.create({
    defaultTextInput: {
        height: defaultTextInputHeight,
        fontSize: defaultFontSize,
        padding: 4,
        flex: 1,
    },
    defaultText: {
        height: defaultTextInputHeight,
        fontSize: defaultFontSize,
    },
    defaultIcon: {
        padding: 4,
        width: defaultIconSize,
    },
    pullRight:{
        alignSelf: 'flex-end',
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap: 'nowrap'
    },
    self: {
        fontSize: 16,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#444444',
        color: '#ffffff',
    },
    messagesList: {
      flex: 1,
    },
    messagesSender: {
        padding: 5,
        margin: 10,
        flexWrap: 'wrap',
        backgroundColor: '#ff0000',
        alignSelf: 'flex-end',
        borderRadius: 10
    },

    messagesReceiver: {
        padding: 5,
        margin: 10,
        backgroundColor: '#ff0000',
        alignSelf: 'flex-start',
        borderRadius: 10
    },

});

