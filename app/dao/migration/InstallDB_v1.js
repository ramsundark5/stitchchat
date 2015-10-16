import DBHelper from '../DBHelper';
const  CONTACTS_DB = "contacts.db";
const  MESSAGES_DB = "messages.db";

class InstallDB_v1{

    apply(){
        let createContactsTable = 'CREATE TABLE if not exists Contact '+
                                        '(id                    integer     primary key autoincrement, ' +
                                        'firstName              text,'+
                                        'lastName               text,'+
                                        'email                  text,'+
                                        'displayName            text,'+
                                        'remoteName             text,'+
                                        'phoneType              text,'+
                                        'phoneLabel             text,'+
                                        'phoneNumber            text,'+
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
                                            'groupUid               text,'+
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
                                            'uid                    text,'+
                                            'threadId               integer,'+
                                            'senderId               text,'+
                                            'receiverId             text,'+
                                            'status                 integer,'+
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
                                            'needsPush              integer'+
                                            'extras                 text)';
        /*let groupInfoTable     =  'CREATE TABLE GroupInfo id integer primary key autoincrement, uid text,' +
         'name text, threadId integer, photoUrl text,'+
         'ownerId text, lastMessageOwner text, state text,'+
         'extras text, lastModifiedTime integer';

         let groupMemberTable  =  'CREATE TABLE GroupMember groupId integer primary key,' +
         'firstName text, lastName text, email text, displayName text,'+
         'remoteName text, status text, photoUrl text, lastSeenTime integer,'+
         'extras text, lastModifiedTime integer';*/

        let promise1 = DBHelper.executeUpdate(CONTACTS_DB, createContactsTable, ['test']);
        let promise2 = DBHelper.executeUpdate(MESSAGES_DB, threadTable, ['test']);
        let promise3 = DBHelper.executeUpdate(MESSAGES_DB, messageTable, ['test']);
        return Promise.all([promise1, promise2, promise3]);
    }
}
module.exports = new InstallDB_v1();