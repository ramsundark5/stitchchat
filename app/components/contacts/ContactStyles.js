import { StyleSheet } from 'react-native';
import {defaultStyle, commons} from '../styles/CommonStyles'
const threadNormalBgColor     = '#257DF7';

export const contactStyle = StyleSheet.create({
    contactItemContainer: {
        padding: 10
    },
    avatar: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        marginLeft: 10,
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
    contactDivider:{
        margin: 10,
        height: 1,
        backgroundColor: '#dddddd'
    },
});