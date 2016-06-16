const Realm = require('realm');

//console.log('realm path is '+Realm.defaultPath);
module.exports = new Realm({
    schemaVersion: 2,
    schema: [
        {
            name: 'Profile',
            properties: [
                {name: 'phoneNumber', type: Realm.Types.STRING, optional: true},
                {name: 'displayName', type: Realm.Types.STRING, optional: true},
                {name: 'countryCode', type: Realm.Types.STRING, optional: true},
                {name: 'isContactInitialized', type: Realm.Types.BOOL, default: false},
                {name: 'statusMessage', type: Realm.Types.STRING, optional: true},
                {name: 'photo', type: Realm.Types.STRING, optional: true},
                {name: 'thumbNailPhoto', type: Realm.Types.STRING, optional: true},
                {name: 'lastContactSyncTime', type: Realm.Types.DATE, default: new Date()},
            ]
        },
        {
            name: 'Contact',
            primaryKey: 'phoneNumber',
            properties: [
                {name: 'phoneNumber', type: Realm.Types.STRING},
                {name: 'displayName', type: Realm.Types.STRING, default: ''},
                {name: 'phoneType', type: Realm.Types.STRING, optional: true},
                {name: 'phoneLabel', type: Realm.Types.STRING, optional: true},
                {name: 'localContactIdLink', type: Realm.Types.STRING, optional: true},
                {name: 'abRecordIdLink', type: Realm.Types.INT, default: -1},
                {name: 'androidLookupKey', type: Realm.Types.STRING, optional: true},
                {name: 'isRegisteredUser', type: Realm.Types.BOOL, default: false},
                {name: 'status', type: Realm.Types.INT, default: 0},
                {name: 'photo', type: Realm.Types.STRING, optional: true},
                {name: 'thumbNailPhoto', type: Realm.Types.STRING, optional: true},
                {name: 'isBlocked', type: Realm.Types.BOOL, default: false},
                {name: 'lastSeenTime', type: Realm.Types.DATE, optional: true},
                {name: 'lastModifiedTime', type: Realm.Types.DATE, default: new Date()},
            ]
        },
        {
            name: 'Thread',
            primaryKey: 'id',
            properties: [
                {name: 'id', type: Realm.Types.INT},
                {name: 'contactInfo', type: Realm.Types.OBJECT, objectType: 'Contact', optional: true},
                {name: 'groupInfo', type: Realm.Types.OBJECT, objectType: 'GroupInfo', optional: true},
                {name: 'recipientPhoneNumber', type: Realm.Types.STRING, optional: true},
                {name: 'isGroupThread', type: Realm.Types.BOOL},
                {name: 'direction', type: Realm.Types.INT},
                {name: 'count', type: Realm.Types.INT},
                {name: 'unreadCount', type: Realm.Types.INT},
                {name: 'mimeType', type: Realm.Types.STRING, optional: true},
                {name: 'lastMessageText', type: Realm.Types.STRING, optional: true},
                {name: 'lastMessageTime', type: Realm.Types.DATE, default: new Date()},
                {name: 'isMuted', type: Realm.Types.BOOL, default: false},
            ]
        },
        {
            name: 'GroupInfo',
            primaryKey: 'uid',
            properties: [
                {name: 'uid', type: Realm.Types.STRING},
                {name: 'displayName', type: Realm.Types.STRING, optional: true},
                {name: 'photoUrl', type: Realm.Types.STRING, optional: true},
                {name: 'thumbNailPhotoUrl', type: Realm.Types.STRING, optional: true},
                {name: 'status', type: Realm.Types.STRING, optional: true},
                {name: 'statusMessage', type: Realm.Types.STRING, optional: true},
                {name: 'ownerId', type: Realm.Types.STRING, optional: true},
                {name: 'lastMessageOwner', type: Realm.Types.STRING, optional: true},
                {name: 'lastMessageTime', type: Realm.Types.DATE, default: new Date()},
            ]
        },
        {
            name: 'Message',
            primaryKey: 'id',
            properties: [
                {name: 'id', type: Realm.Types.INT},
                {name: 'senderTrackingId', type: Realm.Types.INT, default: -1},
                {name: 'receiverTrackingId', type: Realm.Types.INT, default: -1},
                {name: 'threadId', type: Realm.Types.INT},
                {name: 'contactInfo', type: Realm.Types.OBJECT, objectType: 'Contact', optional: true},
                {name: 'senderId', type: Realm.Types.STRING, optional: true},
                {name: 'receiverId', type: Realm.Types.STRING, optional: true},
                {name: 'remoteName', type: Realm.Types.STRING, optional: true},
                {name: 'status', type: Realm.Types.INT, default: 0},
                {name: 'mediaStatus', type: Realm.Types.INT, default: 0},
                {name: 'message', type: Realm.Types.STRING},
                {name: 'direction', type: Realm.Types.INT, default: 0},
                {name: 'thumbImageUrl', type: Realm.Types.STRING, optional: true},
                {name: 'attachmentId', type: Realm.Types.STRING, optional: true},
                {name: 'mediaUrl', type: Realm.Types.STRING, optional: true},
                {name: 'mediaMimeType', type: Realm.Types.STRING, optional: true},
                {name: 'mediaDesc', type: Realm.Types.STRING, optional: true},
                {name: 'latitude', type: Realm.Types.STRING, optional: true},
                {name: 'longitude', type: Realm.Types.STRING, optional: true},
                {name: 'type', type: Realm.Types.INT, default: 0},
                {name: 'ttl', type: Realm.Types.INT, optional: true},
                {name: 'isOwner', type: Realm.Types.BOOL, optional: true},
                {name: 'timestamp', type: Realm.Types.DATE, default: new Date()},
                {name: 'needsPush', type: Realm.Types.BOOL, default: true},
            ]
        },
        {
            name: 'Sequence',
            primaryKey: 'name',
            properties: [
                {name: 'name', type: Realm.Types.STRING},
                {name: 'value', type: Realm.Types.INT, default: 1},
            ]
        },
        {
            name: 'Preference',
            primaryKey: 'key',
            properties: [
                {name: 'key', type: Realm.Types.STRING},
                {name: 'value', type: Realm.Types.STRING},
            ]
        }
    ],
});

