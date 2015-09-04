import { StyleSheet } from 'react-native';

export const defaultFontSize    = 14;
export const smallFontSize      = 14;
export const bgColor            = '';
export const headerColor        = '';
export const defaultIconColor   = '#333333';
export const defaultIconSize    = 30;
export const smallIconSize      = 16;
export const defaultTextInputHeight = 26;
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
    smallText: {
        fontSize: smallFontSize,
        paddingRight: 4
    },
    defaultIconContainer:{
    },
    defaultIcon: {
       // padding: 4,
        width: defaultIconSize,
        height: defaultIconSize,
    },
    smallIcon: {
        width: smallIconSize,
        height: smallIconSize,
    },
    pullRight:{
        alignSelf: 'flex-end',
    },
    pullLeft:{
        alignSelf: 'flex-start',
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap: 'nowrap'
    }
});

