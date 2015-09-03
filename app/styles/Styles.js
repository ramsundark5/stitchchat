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
        fontSize: defaultFontSize,
    },
    defaultIconContainer:{
    },
    defaultIcon: {
        padding: 4,
        width: defaultIconSize,
        height: defaultIconSize,
    },
    pullRight:{
        alignSelf: 'flex-end',
    },
    pullLeft:{
        alignSelf: 'flex-end',
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap: 'nowrap'
    }
});

