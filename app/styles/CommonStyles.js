import { StyleSheet } from 'react-native';


export const defaultStyle = {
    fontSize           : 14,
    smallFontSize      : 12,
    bgColor            :'#ff0000',
    headerColor        :'',
    iconColor          : '#333333',
    iconSize           : 30,
    smallIconSize      : 16,
    textInputHeight    : 26
};

export const commons = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
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
        width : defaultStyle.iconSize,
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
    stretch:{
        alignItems: 'stretch',
    },
    messageComposer:{
        backgroundColor: defaultStyle.bgColor,
    },
    separator: {
        height: 1,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#dddddd'
    },
    verticalWrap:{
        flexDirection : 'column',
        flexWrap      : 'wrap',
        alignItems: 'flex-start'
    }
});

