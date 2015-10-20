import { StyleSheet } from 'react-native';
import {defaultStyle, commons} from '../styles/CommonStyles'
const threadNormalBgColor     = '#257DF7';

export const contactStyle = StyleSheet.create({
    contactItemContainer: {
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
});