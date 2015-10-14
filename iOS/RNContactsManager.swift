
import Foundation
import Contacts

@objc(RNContactsManager)
class RNContactsManager: NSObject{
  var contactStore = CNContactStore()
  var contacts = [CNContact]()
  
  @objc func getAllContactsWithPhoneNumber(resolve: RCTPromiseResolveBlock,
                                           rejecter reject : RCTPromiseRejectBlock) -> Void {
                                          
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
              })
            }
            else {
              dispatch_async(dispatch_get_main_queue(), { () -> Void in
                self.didFetchContacts(contacts)
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
  
  func didFetchContacts(contacts: [CNContact]) {
    let rnSqlite = RNSqlite()
    let dbPath = rnSqlite.getDBPath("contacts.db")
    rnSqlite.executeUpdate(dbPath, sqlStmt: "create table bulktest1 (id integer primary key autoincrement, x text)")
    for contact in contacts {
      self.contacts.append(contact)
    }
    
  }
}