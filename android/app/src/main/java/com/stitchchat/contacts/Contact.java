package com.stitchchat.contacts;

public class Contact {

    private String displayName;
    private String phoneNumber;
    private String photoURI;
    private String thumbNailPhotoURI;
    private String contactID;
    private String lookupKey;

    public Contact(String displayName, String phoneNumber, String photoURI, String thumbNailPhotoURI, String contactID, String lookupKey) {
        this.displayName = displayName;
        this.phoneNumber = phoneNumber;
        this.photoURI = photoURI;
        this.thumbNailPhotoURI = thumbNailPhotoURI;
        this.contactID = contactID;
        this.lookupKey = lookupKey;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getContactID() {
        return contactID;
    }

    public void setContactID(String contactID) {
        this.contactID = contactID;
    }

    public String getLookupKey() {
        return lookupKey;
    }

    public void setLookupKey(String lookupKey) {
        this.lookupKey = lookupKey;
    }

    public String getPhotoURI() {
        return photoURI;
    }

    public void setPhotoURI(String photoURI) {
        this.photoURI = photoURI;
    }

    public String getThumbNailPhotoURI() {
        return thumbNailPhotoURI;
    }

    public void setThumbNailPhotoURI(String thumbNailPhotoURI) {
        this.thumbNailPhotoURI = thumbNailPhotoURI;
    }
}
