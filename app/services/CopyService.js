import Clipboard from 'react-native-clipboard';
import * as _ from 'lodash';

export function  copyMessagesToClipBoard(copiedMessageList) {
    let copiedTextList = _.pluck(copiedMessageList, 'text');
    let copiedMessages = copiedTextList.join('\n');
    Clipboard.set(copiedMessages);
}