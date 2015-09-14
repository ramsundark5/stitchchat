//import Clipboard from 'react-native-clipboard';
import * as _ from 'lodash';

export function  copyMessagesToClipBoard(copiedMessageList) {
    let copiedTextList = _.pluck(copiedMessageList, 'text');
    let copiedMessages = copiedTextList.join('\n');
    //this is a temp fix till I figure out how to mock react native modules using mocha
    let Clipboard = require('react-native-clipboard');
    Clipboard.set(copiedMessages);
}