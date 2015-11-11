

#import <Foundation/Foundation.h>
#import <AddressBook/AddressBook.h>
#import <UIKit/UIKit.h>
#import "Contact.h"
#import "FMDB.h"
#import "NBPhoneNumberUtil.h"

@interface ContactsSyncer : NSObject
@end

@implementation ContactsSyncer

-(void) syncContacts
{
  CFErrorRef creationError = nil;
  ABAddressBookRef addressBookRef = ABAddressBookCreateWithOptions(NULL, &creationError);
  if(creationError != nil){
    NSString* errorMsg = [((__bridge NSError *)creationError) localizedDescription];
    NSLog(@"Addressbook creation error:%@", errorMsg);
  }
  
  ABAddressBookRequestAccessWithCompletion(addressBookRef, ^(bool granted, CFErrorRef error) {
    if (!granted) {
      [ContactsSyncer blockingContactDialog];
    }
  });
  [self refreshContacts:addressBookRef];
}

-(void) refreshContacts:(ABAddressBookRef) addressBookRef
{
  
  if(!addressBookRef){
    return;
  }
  
  NSMutableArray *changedContacts = [[NSMutableArray alloc]init];

  CFArrayRef peopleRefs = ABAddressBookCopyArrayOfAllPeopleInSource(addressBookRef, kABSourceTypeLocal);
  
  
  ABAddressBookRevert(addressBookRef);
  
  CFIndex count = CFArrayGetCount(peopleRefs);
  
  for (CFIndex i=0; i < count; i++) {
    ABRecordRef ref = CFArrayGetValueAtIndex(peopleRefs, i);
    NSDate* datemod = (__bridge_transfer NSDate *)(ABRecordCopyValue(ref, kABPersonModificationDateProperty));
    
    
    NSTimeInterval datemodifiedtime =[datemod timeIntervalSince1970];
    //int seconds = round(distanceBetweenDates);
    
    //compare datemodifiedtime of addressbook contact with lastmodified time in our db
    if (true) {
      ABRecordRef record = CFArrayGetValueAtIndex(peopleRefs,i);
      NSArray* contactsForRecord = [self contactsForRecord:record];
      [changedContacts addObjectsFromArray:contactsForRecord];
    }
  }
  CFRelease(peopleRefs);
  if (addressBookRef) {
    CFRelease(addressBookRef);
  }
  //save changed contacts to local db
  [self saveChangedContacts:changedContacts];
}

- (NSArray *)contactsForRecord:(ABRecordRef)record
{
    ABRecordID recordID = ABRecordGetRecordID(record);
    NSMutableArray *contacts = [[NSMutableArray alloc]init];

    NSString *firstName = (__bridge_transfer NSString*)ABRecordCopyValue(record, kABPersonFirstNameProperty);
    NSString *lastName = (__bridge_transfer NSString*)ABRecordCopyValue(record, kABPersonLastNameProperty);
    NSArray *phoneNumbers = [self phoneNumbersForRecord:record];
    
    if (!firstName && !lastName) {
      NSString *companyName = (__bridge_transfer NSString*)ABRecordCopyValue(record, kABPersonOrganizationProperty);
      if (companyName) {
        firstName = companyName;
      } else if (phoneNumbers.count) {
        firstName =	phoneNumbers.firstObject;
      }
    }
  
    for (NSUInteger i = 0; i < phoneNumbers.count; i++) {
      NSData *image = (__bridge_transfer NSData*)ABPersonCopyImageDataWithFormat(record, kABPersonImageFormatThumbnail);
      UIImage *img = [UIImage imageWithData:image];
      
       Contact* contact = [Contact contactWithFirstName:firstName
                               andLastName:lastName
                            andPhoneNumber:phoneNumbers[i]
                                  andImage:img
                              andContactID:recordID];
      [contacts addObject:contact];

    }
    return contacts;
}

- (NSArray *)phoneNumbersForRecord:(ABRecordRef)record
{
    ABMultiValueRef numberRefs = ABRecordCopyValue(record, kABPersonPhoneProperty);
    
    @try {
      NSArray *phoneNumbers = (__bridge_transfer NSArray*)ABMultiValueCopyArrayOfAllValues(numberRefs);
      
      if (phoneNumbers == nil) phoneNumbers = @[];
      
      NSMutableArray *numbers = [NSMutableArray array];
      
      for (NSUInteger i = 0; i < phoneNumbers.count; i++) {
        NSString *phoneNumber = phoneNumbers[i];
        [numbers addObject:phoneNumber];
      }
      
      return numbers;
      
    } @finally {
      if (numberRefs) {
        CFRelease(numberRefs);
      }
    }
}

-(void) saveChangedContacts:(NSArray*) changedContacts
{
  NSString* dbPath = [self getDBPath:@"contacts.db"];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    [db beginTransaction];
    
    for (NSUInteger i = 0; i < changedContacts.count; i++) {
      Contact *contact = changedContacts[i];
      NSLog(@"ready to update contact @", contact.phoneNumber);
    }
    
    [db commit];
  }];
  
  
}

+ (void)blockingContactDialog{
  switch (ABAddressBookGetAuthorizationStatus()) {
    case kABAuthorizationStatusRestricted:{
      UIAlertController *controller = [UIAlertController
          alertControllerWithTitle:NSLocalizedString(@"AB_PERMISSION_MISSING_TITLE", nil)
          message:NSLocalizedString(@"ADDRESSBOOK_RESTRICTED_ALERT_BODY", nil)
          preferredStyle:UIAlertControllerStyleAlert];
      
      [controller addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"ADDRESSBOOK_RESTRICTED_ALERT_BUTTON", nil)
          style:UIAlertActionStyleDefault
          handler:^(UIAlertAction *action) {exit(0);}
       ]];
      
      [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:controller animated:YES completion:nil];
      
      break;
    }
    case kABAuthorizationStatusDenied: {
      UIAlertController *controller = [UIAlertController
          alertControllerWithTitle:NSLocalizedString(@"AB_PERMISSION_MISSING_TITLE", nil)
          message:NSLocalizedString(@"AB_PERMISSION_MISSING_BODY", nil)
          preferredStyle:UIAlertControllerStyleAlert];
      
      [controller addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"AB_PERMISSION_MISSING_ACTION", nil)
          style:UIAlertActionStyleDefault
          handler:^(UIAlertAction *action) {
                    [[UIApplication sharedApplication]
                     openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
                   }
       ]];
      
      [[[UIApplication sharedApplication] keyWindow].rootViewController presentViewController:controller animated:YES completion:nil];
      break;
    }
      
    case kABAuthorizationStatusNotDetermined: {
      NSLog(@"AddressBook access not granted but status undetermined.");
      break;
    }
      
    case kABAuthorizationStatusAuthorized:{
      NSLog(@"AddressBook access not granted but status authorized.");
      break;
    }
      
    default:
      break;
  }
}

- (NSString *)getDBPath:(NSString *)dbName
{
  NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDir = [docPaths objectAtIndex:0];
  NSString *dbPath = [documentsDir   stringByAppendingPathComponent:dbName];
  NSLog(@"DB path is%@", dbPath);
  return dbPath;
}

+ (NSString*) toE164:(NSString*) phoneNumberStr
         countryCode:(NSString*) countryCode{
  NSString* e164Number = nil;
  NBPhoneNumberUtil *phoneUtil = [[NBPhoneNumberUtil alloc] init];
  NSError *numberParseError = nil;
  @try{
    NBPhoneNumber *number = [phoneUtil parse:phoneNumberStr
                               defaultRegion:countryCode error:&numberParseError];
    
    if (numberParseError == nil) {
      
      NSError* toE164Error;
      e164Number = [phoneUtil format:number
                        numberFormat:NBEPhoneNumberFormatE164
                               error:&toE164Error];
      if(toE164Error != nil){
        NSLog(@"Error formatting phone number %@ to e164: %@", phoneNumberStr, [toE164Error localizedDescription]);
      }
      
    } else {
      NSLog(@"Error parsing phone number: %@ - %@", phoneNumberStr, [numberParseError localizedDescription]);
    }
    
  }@catch(NSError *error){
    NSLog(@"Unexpected phone parse error: %@ - %@", phoneNumberStr, [error localizedDescription]);
  }
  return e164Number;
}

@end
