
#import <Foundation/Foundation.h>
#import <AddressBook/AddressBook.h>
#import <UIKit/UIKit.h>
#import "ContactUtils.h"
#import "RCTBridgeModule.h"

@interface ContactsSyncer : NSObject <RCTBridgeModule>
@end

@implementation ContactsSyncer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD (syncContacts:(NSString*)countryCode
                   lastContactSyncTime:(nonnull NSNumber*)lastContactSyncTime
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    if(!countryCode){
      resolve(@"no country code found. Aborting sync.");
      return;
    }
    
    CFErrorRef creationError = nil;
    ABAddressBookRef addressBookRef = ABAddressBookCreateWithOptions(NULL, &creationError);
    if(creationError != nil){
      NSString* errorMsg = [((__bridge NSError *)creationError) localizedDescription];
      NSLog(@"Addressbook creation error:%@", errorMsg);
    }
    
    ABAddressBookRequestAccessWithCompletion(addressBookRef, ^(bool granted, CFErrorRef error) {
      if (!granted) {
        [self blockingContactDialog];
      }
    });
    
    NSArray* changedContacts = [self getChangedContacts:addressBookRef countryCode:countryCode lastContactSyncTime:lastContactSyncTime];
    
    //NSNumber *currentTime = [NSNumber numberWithLongLong:[[NSDate date] timeIntervalSince1970] * 1000];
    //[self updateLastContactSyncTime:currentTime];
    resolve(changedContacts);
  }@catch (NSException *ex) {
    NSLog(@"Error syncing contacts%@", ex.reason);
    NSString* errMsg = [NSString stringWithFormat:@"%@/%@", @"Exception syncing contacts. Error is ", ex.reason];
    NSError *error = [NSError errorWithDomain:@"stitchchat"
                                       code:100
                                   userInfo:@{
                                              NSLocalizedDescriptionKey:errMsg
                                              }];
    reject(errMsg, nil, error);
  }
  
}

-(NSArray*) getChangedContacts:(ABAddressBookRef) addressBookRef
            countryCode:(NSString*)countryCode
    lastContactSyncTime:(NSNumber*)lastContactSyncTime
{
  
  if(!addressBookRef){
    return nil;
  }
  NSMutableArray *changedContacts = [[NSMutableArray alloc]init];

  CFArrayRef peopleRefs = ABAddressBookCopyArrayOfAllPeopleInSource(addressBookRef, kABSourceTypeLocal);
  
  
  ABAddressBookRevert(addressBookRef);
  
  CFIndex count = CFArrayGetCount(peopleRefs);
  
  for (CFIndex i=0; i < count; i++) {
    ABRecordRef ref = CFArrayGetValueAtIndex(peopleRefs, i);
    NSDate* datemod = (__bridge_transfer NSDate *)(ABRecordCopyValue(ref, kABPersonModificationDateProperty));
    
    NSNumber *datemodifiedtime = [NSNumber numberWithLongLong:
                                  [datemod timeIntervalSince1970] * 1000];
    //int seconds = round(distanceBetweenDates);
    
    //compare datemodifiedtime of addressbook contact with lastmodified time in our db
    if (datemodifiedtime > lastContactSyncTime) {
      ABRecordRef record = CFArrayGetValueAtIndex(peopleRefs,i);
      NSArray* contactsForRecord = [self contactsForRecord:record countryCode:countryCode];
      [changedContacts addObjectsFromArray:contactsForRecord];
    }
  }
  CFRelease(peopleRefs);
  if (addressBookRef) {
    CFRelease(addressBookRef);
  }
  
  return changedContacts;
}

- (NSArray *)contactsForRecord:(ABRecordRef)record
                   countryCode:(NSString*)countryCode
{
    ABRecordID abRecordID = ABRecordGetRecordID(record);
    NSNumber *recordID = [NSNumber numberWithInt:(int)abRecordID];
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
  
    NSString *displayName = [ContactUtils getDisplayName:firstName lastName:lastName];
    for (NSUInteger i = 0; i < phoneNumbers.count; i++) {
      NSData *image = (__bridge_transfer NSData*)ABPersonCopyImageDataWithFormat(record, kABPersonImageFormatThumbnail);
      UIImage *img = [UIImage imageWithData:image];
      NSString* e164Number = [ContactUtils toE164:phoneNumbers[i] countryCode:countryCode];
      if(!e164Number){
        continue;
      }
      
      NSMutableDictionary *contactToBeSaved = [[NSMutableDictionary alloc] init];
      [contactToBeSaved setObject:e164Number       forKey:@"phoneNumber"];
      [contactToBeSaved setObject:displayName      forKey:@"displayName"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"localContactIdLink"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"phoneLabel"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"phoneType"];
      [contactToBeSaved setObject:recordID         forKey:@"abRecordIdLink"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"androidLookupKey"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"photo"];
      [contactToBeSaved setObject:[NSNull null]    forKey:@"thumbNailPhoto"];
      
      [contacts addObject:contactToBeSaved];

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

- (void)blockingContactDialog{
    NSString* AB_PERMISSION_MISSING_TITLE = @"Sorry!";
    NSString* ADDRESSBOOK_RESTRICTED_ALERT_BODY = @"Stitchchat requires access to your contacts. Access to contacts is restricted. Stitchchat will close. You can disable the restriction temporarily to let Stitchchat access your contacts by going the Settings app >> General >> Restrictions >> Contacts >> Allow Changes.";
    NSString* AB_PERMISSION_MISSING_BODY = @"Stitchchat requires access to your contacts. We do not store your contacts on our servers.";
    NSString* AB_PERMISSION_MISSING_ACTION = @"Give access";
             
    switch (ABAddressBookGetAuthorizationStatus()) {
      case kABAuthorizationStatusRestricted:{
        UIAlertController *controller = [UIAlertController
            alertControllerWithTitle:AB_PERMISSION_MISSING_TITLE
            message:ADDRESSBOOK_RESTRICTED_ALERT_BODY
            preferredStyle:UIAlertControllerStyleAlert];
        
        [controller addAction:[UIAlertAction actionWithTitle:@"Close"
            style:UIAlertActionStyleDefault
            handler:^(UIAlertAction *action) {exit(0);}
         ]];
        
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:controller animated:YES completion:nil];
        
        break;
      }
      case kABAuthorizationStatusDenied: {
        UIAlertController *controller = [UIAlertController
            alertControllerWithTitle:AB_PERMISSION_MISSING_TITLE
            message:AB_PERMISSION_MISSING_BODY
            preferredStyle:UIAlertControllerStyleAlert];
        
        [controller addAction:[UIAlertAction actionWithTitle:AB_PERMISSION_MISSING_ACTION
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
        //[self syncContactsInternal];
        break;
      }
        
      default:
        break;
    }
}

@end
