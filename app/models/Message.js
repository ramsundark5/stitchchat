import uuid from 'node-uuid';
import * as Status from '../constants/MessageConstants.js';

export default class Message{
    constructor(text) {
        this.id          = uuid.v4();
        this.text        = text;
        this.selected    = false;
        this.status      = Status.STATUS_PENDING;
    }
}

