import uuid from 'node-uuid';
import * as Status from '../constants/MessageConstants.js';
import * as _ from 'lodash';

export default class Message{
    constructor(text) {
        this.id          = uuid.v4();
        this.text        = text;
        this.selected    = false;
        this.status      = Status.STATUS_PENDING;
        this.sequenceId  = _.uniqueId('message'); //used for sorting
    }
}

