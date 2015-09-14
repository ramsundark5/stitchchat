import { StyleSheet } from 'react-native';
import {defaultStyle, commons} from './CommonStyles'
const threadNormalBgColor     = '#257DF7';

export const threadStyle = StyleSheet.create({
    threadItemContainer: {
        flexDirection: 'row',
        padding: 10
    },
    avatar: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    lastMessageText: {
        fontSize: defaultStyle.fontSize,
        padding: 10
    },
    title: {
        fontSize: defaultStyle.fontSize,
        color: '#656565',
        fontWeight: 'bold',
        flex: 1
    },
    threadOptions: {
        flex: 1,
        flexDirection : 'row',
        flexWrap      : 'nowrap',
        justifyContent: 'space-around',
    },
    timestamp: {
        flex: 0,
        fontSize: defaultStyle.smallFontSize
    }
});