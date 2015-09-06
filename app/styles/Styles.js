import { StyleSheet } from 'react-native';


export const defaultStyle = {
    fontSize           : 14,
    smallFontSize      : 14,
    bgColor            :'#ff0000',
    headerColor        :'',
    iconColor          : '#333333',
    iconSize           : 30,
    smallIconSize      : 16,
    textInputHeight    : 26
};

export const commons = StyleSheet.create({
    defaultTextInput: {
        height  : defaultStyle.textInputHeight,
        fontSize: defaultStyle.fontSize,
        padding : 4,
        flex    : 1,
    },
    defaultText: {
        fontSize: defaultStyle.fontSize,
    },
    smallText: {
        fontSize    : defaultStyle.smallFontSize,
        paddingRight: 4
    },
    defaultIconContainer:{
    },
    defaultIcon: {
       // padding: 4,
        width : defaultStyle.fontSize,
        height: defaultStyle.iconSize,
    },
    smallIcon: {
        width : defaultStyle.smallIconSize,
        height: defaultStyle.smallIconSize,
    },
    pullRight:{
        alignSelf: 'flex-end',
    },
    pullLeft:{
        alignSelf: 'flex-start',
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    messageComposer:{
        backgroundColor: defaultStyle.bgColor,
    }
});

