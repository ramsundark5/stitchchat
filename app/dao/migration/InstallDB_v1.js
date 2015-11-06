import DBHelper from '../DBHelper';
import * as AppConstants from '../../constants/AppConstants';

class InstallDB_v1{

    apply(){
        let createContactsTable = 'CREATE TABLE if not exists Contact '+
                                        '(phoneNumber           text     primary key, ' +
                                        'firstName              text,'+
                                        'lastName               text,'+
                                        'email                  text,'+
                                        'displayName            text,'+
                                        'remoteName             text,'+
                                        'phoneType              text,'+
                                        'phoneLabel             text,'+
                                        'localContactIdLink     text,'+
                                        'abRecordIdLink         text,'+
                                        'isRegisteredUser       integer,'+
                                        'status                 integer,'+
                                        'photo                  text,'+
                                        'thumbNailPhoto         text,'+
                                        'lastSeenTime           integer,'+
                                        'extras                 text,'+
                                        'lastModifiedTime       integer)';

        let threadTable       =  'CREATE TABLE if not exists Thread '+
                                            '(id                    integer primary key autoincrement,' +
                                            'recipientPhoneNumber   text,'+
                                            'displayName            text,'+
                                            'isGroupThread          integer,'+
                                            'groupUid               text    unique,'+
                                            'direction              integer,'+
                                            'count                  integer,'+
                                            'unreadCount            integer,'+
                                            'mimeType               text,'+
                                            'lastMessageText        text,'+
                                            'lastMessageTime        integer,'+
                                            'isMuted                integer,'+
                                            'extras                 text,'+
                                            'lastModifiedTime       integer)';

        let messageTable       =  'CREATE TABLE if not exists Message'+
                                            '(id                    integer primary key autoincrement,'+
                                            'threadId               integer,'+
                                            'senderId               text,'+
                                            'receiverId             text,'+
                                            'status                 integer,'+
                                            'mediaStatus            integer,'+
                                            'isGroupThread          integer,'+
                                            'message                text,'+
                                            'direction              integer,'+
                                            'thumbImageUrl          text,'+
                                            'mediaUrl               text,'+
                                            'mediaMimeType          text,'+
                                            'mediaDesc              text,'+
                                            'latitude               text,'+
                                            'longitude              text,'+
                                            'type                   integer,'+
                                            'ttl                    integer,'+
                                            'isOwner                integer,'+
                                            'timestamp              integer,'+
                                            'needsPush              integer,'+
                                            'extras                 text)';

        let messageRemoteIdTable = 'CREATE TABLE if not exists MessageRemoteID' +
                                            '(uid                   text primary key,' +
                                            'messageId              integer unique)';

        let preferenceTable      = 'CREATE TABLE if not exists Preferences'+
                                            '(key         text  unique,'+
                                            'value        text       )';
        /*let groupInfoTable     =  'CREATE TABLE GroupInfo id integer primary key autoincrement, uid text,' +
         'name text, threadId integer, photoUrl text,'+
         'ownerId text, lastMessageOwner text, state text,'+
         'extras text, lastModifiedTime integer';

         let groupMemberTable  =  'CREATE TABLE GroupMember groupId integer primary key,' +
         'firstName text, lastName text, email text, displayName text,'+
         'remoteName text, status text, photoUrl text, lastSeenTime integer,'+
         'extras text, lastModifiedTime integer';*/

        let promise1 = DBHelper.executeUpdate(AppConstants.CONTACTS_DB, createContactsTable);
        let promise2 = DBHelper.executeUpdate(AppConstants.CONTACTS_DB, preferenceTable);
        let promise3 = DBHelper.executeUpdate(AppConstants.MESSAGES_DB, threadTable);
        let promise4 = DBHelper.executeUpdate(AppConstants.MESSAGES_DB, messageTable);
        let promise5 = DBHelper.executeUpdate(AppConstants.MESSAGES_DB, messageRemoteIdTable);

        return Promise.all([promise1, promise2, promise3, promise4, promise5]);
    }
}
export default new InstallDB_v1();