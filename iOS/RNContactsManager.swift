
import Foundation
import Contacts

@objc(RNContactsManager)
class RNContactsManager: NSObject{
  var contactStore = CNContactStore()
  var contacts = [CNContact]()
  
  @objc func initializeContacts(countryCode: String,
                                resolver resolve: RCTPromiseResolveBlock,
                                rejecter reject : RCTPromiseRejectBlock) -> Void {
       
      if(countryCode.isEmpty){
        return;
      }
      self.requestForAccess({ (accessGranted) -> Void in
          if accessGranted {
            
            let keys = [CNContactGivenNameKey, CNContactFamilyNameKey, CNContactEmailAddressesKey, CNContactPhoneNumbersKey, CNContactImageDataKey, CNContactIdentifierKey]
            
            let fetchRequest = CNContactFetchRequest(keysToFetch: keys)
            
            var contacts = [CNContact]()
            var message: String!
            
            do {
              try self.contactStore.enumerateContactsWithFetchRequest(fetchRequest, usingBlock: { (let contact, let stop) -> Void in
                contacts.append(contact)
              })
            }
            catch let error as NSError {
              print(error.localizedDescription)
              message = "Unable to fetch contacts. "
              message = message + error.localizedDescription
            } 
            
            if message != nil {
              dispatch_async(dispatch_get_main_queue(), { () -> Void in
                self.showMessage(message)
                resolve("permission denied")
              })
            }
            else {
              dispatch_async(dispatch_get_main_queue(), { () -> Void in
                let contactsToSave = self.getContactsForSave(countryCode, contacts: contacts)
                resolve(contactsToSave)
              })
            }
            
          }
      })
      
  }
  
  func requestForAccess(completionHandler: (accessGranted: Bool) -> Void) {
    let authorizationStatus = CNContactStore.authorizationStatusForEntityType(CNEntityType.Contacts)
    
    switch authorizationStatus {
    case .Authorized:
      completionHandler(accessGranted: true)
      
    case .Denied, .NotDetermined:
      self.contactStore.requestAccessForEntityType(CNEntityType.Contacts, completionHandler: { (access, accessError) -> Void in
        if access {
          completionHandler(accessGranted: access)
        }
        else {
          if authorizationStatus == CNAuthorizationStatus.Denied {
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
              let message = "\(accessError!.localizedDescription)\n\nPlease allow the app to access your contacts through the Settings."
              self.showMessage(message)
            })
          }
        }
      })
      
    default:
      completionHandler(accessGranted: false)
    }
  }
  
  func showMessage(message: String) {
    //tell React native to show alert modal about contacts issue denied
  }
  
  func getContactsForSave(countryCode: String, contacts: [CNContact]) -> (NSArray){
    
    let contactsToBeSaved:NSMutableArray! = NSMutableArray()
    
    for contact:CNContact in contacts {
      for phoneNumberMap:CNLabeledValue in contact.phoneNumbers {
        let phoneNumberObj: CNPhoneNumber = phoneNumberMap.value as! CNPhoneNumber
        let phoneNumber = phoneNumberObj.stringValue
        let phoneLabel  = ContactUtils.removeNonAlphaNumericChars(phoneNumberMap.label)
        let e164Number  = ContactUtils.toE164(phoneNumber, countryCode: countryCode)
        
        if((e164Number == nil)){
          continue
        }
        
        let abRecordLink = -1 //not available at first init bcoz we are using new contacts framework
        var contactToBesaved = [String: AnyObject]()
        contactToBesaved["phoneNumber" ] = e164Number
        contactToBesaved["displayName"] = ContactUtils.getDisplayName(contact.givenName, lastName: contact.familyName)
        contactToBesaved["localContactIdLink"] = contact.identifier
        contactToBesaved["phoneLabel"] = phoneLabel
        contactToBesaved["phoneType"] = NSNull()
        contactToBesaved["abRecordIdLink"] = abRecordLink
        contactToBesaved["androidLookupKey"] = NSNull()
        contactToBesaved["photo"] = NSNull()
        contactToBesaved["thumbNailPhoto"] = NSNull()
        
        contactsToBeSaved.addObject(contactToBesaved)
      }
    }
    return contactsToBeSaved
  }
  
}