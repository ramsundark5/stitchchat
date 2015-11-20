package com.stitchchat.contacts;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;
import android.provider.ContactsContract;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.stitchchat.sqlite.SQLiteManager;

import android.provider.ContactsContract.CommonDataKinds.Phone;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

public class RNContactsManager extends ReactContextBaseJavaModule {

    private final String DB_NAME = "messages.db";

    public RNContactsManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNContactsManager";
    }

    @ReactMethod
    public void initializeContacts(final String countryCode){
        if(countryCode == null){
            return;
        }
        List<Contact> allContacts = getAllContacts();
        saveAllContacts(countryCode, allContacts);
    }

    public List<Contact> getAllContacts() {
        List<Contact> contacts = new ArrayList<>();
        Cursor contactsCursor = null;
        try {
            String[] projection = new String[] {
                    ContactsContract.Contacts._ID,
                    Phone.NUMBER,
                    Phone.DISPLAY_NAME,
                    Phone.LOOKUP_KEY,
                    Phone.CONTACT_ID,
                    Phone.PHOTO_THUMBNAIL_URI,
                    Phone.PHOTO_URI
            };
            String selection = ContactsContract.Contacts.IN_VISIBLE_GROUP + " = '" +1+"'"
                            + " AND " + ContactsContract.Contacts.HAS_PHONE_NUMBER + " = '" +1+"'";

            String sortOrder =  Phone.DISPLAY_NAME+ " ASC";

            contactsCursor = getReactApplicationContext()
                    .getContentResolver()
                    .query(Phone.CONTENT_URI,
                            projection,
                            selection,
                            null,
                            sortOrder);
            if(contactsCursor == null){
                return contacts;
            }

            while (contactsCursor.moveToNext()) {
                String phoneNumber = contactsCursor.getString(contactsCursor
                        .getColumnIndex(Phone.NUMBER));
                if (phoneNumber != null) {
                    String displayName = contactsCursor.getString(contactsCursor
                            .getColumnIndex(Phone.DISPLAY_NAME));
                    String contactId = contactsCursor.getString(contactsCursor
                            .getColumnIndex(Phone.CONTACT_ID));
                    String lookupKey = contactsCursor.getString(contactsCursor
                            .getColumnIndex(Phone.LOOKUP_KEY));
                    String photoUri = contactsCursor.getString(contactsCursor
                            .getColumnIndex(Phone.PHOTO_URI));
                    String thumbNailPhotoUri = contactsCursor.getString(contactsCursor
                            .getColumnIndex(Phone.PHOTO_THUMBNAIL_URI));
                    Contact contact = new Contact(displayName, phoneNumber, photoUri, thumbNailPhotoUri, contactId, lookupKey);
                    contacts.add(contact);
                }
            }
        } finally {
            if (contactsCursor != null && !contactsCursor.isClosed()) {
                contactsCursor.close();
            }
        }
        return contacts;
    }

    protected void saveAllContacts(final String countryCode, List<Contact> allContacts){
        SQLiteDatabase db = SQLiteManager.getDatabaseForWrite(DB_NAME);
        String sql = "INSERT OR IGNORE into Contact (phoneNumber, displayName, " +
                        "photo, thumbNailPhoto, localContactIdLink, androidLookupKey, lastModifiedTime) values " +
                        "(?,?,?,?,?,?,?)";
        SQLiteStatement statement = db.compileStatement(sql);
        db.beginTransaction();
        try {
            for (Contact contact : allContacts) {
                try{
                    PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
                    String e164Number = null;
                    try {
                        Phonenumber.PhoneNumber phoneNumber = phoneUtil.parse(contact.getPhoneNumber(), countryCode);
                        e164Number = phoneUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.E164);
                    } catch (NumberParseException e) {
                        Log.e(this.getClass().getCanonicalName(), "NumberParseException was thrown: ", e);
                    }
                    if(e164Number == null){
                        continue;
                    }
                    statement.bindString(1, e164Number);
                    bindStringOrNull(statement, 2, contact.getDisplayName());
                    bindStringOrNull(statement, 3, contact.getPhotoURI());
                    bindStringOrNull(statement, 4, contact.getThumbNailPhotoURI());
                    bindStringOrNull(statement, 5, contact.getContactID());
                    bindStringOrNull(statement, 6, contact.getLookupKey());
                    statement.bindLong(7, System.currentTimeMillis());
                    long insertRowId = statement.executeInsert();
                    Log.d(this.getClass().getCanonicalName(),
                            "contact inserted with rowId"+insertRowId);
                }catch(Exception ex){
                    Log.e(this.getClass().getCanonicalName(),
                            "Exception saving contact", ex);
                }

            }

            db.setTransactionSuccessful();
        } catch (Exception e) {
            Log.e(this.getClass().getCanonicalName(),
                    "Exception initializing contact", e);
        } finally {
            db.endTransaction();
        }
    }

    private void bindStringOrNull(SQLiteStatement statement, int index, String str) {
        if (str == null) {
            statement.bindNull(index);
        } else {
            statement.bindString(index, str);
        }
    }
}
