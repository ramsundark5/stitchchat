
#import <Foundation/Foundation.h>
#import <AddressBook/AddressBook.h>
#import <UIKit/UIKit.h>
#import "Contact.h"
#import "FMDB.h"
#import "NBPhoneNumberUtil.h"
#import "RCTBridgeModule.h"

@interface ContactsSyncer : NSObject <RCTBridgeModule>
@end

@implementation ContactsSyncer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD (syncContacts:(RCTPromiseResolveBlock)resolve
            rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSString* countryCode = [self getCountryCode];
    if(!countryCode){
      resolve(@"no cuntry code found. Aborting sync.");
      return;
    }
    [self syncContactsInternal];
    NSNumber *currentTime = [NSNumber numberWithLongLong:[[NSDate date] timeIntervalSince1970] * 1000];
    [self updateLastContactSyncTime:currentTime];
    resolve(@"sync started");
  }@catch (NSException *ex) {
    NSLog(@"Error syncing contacts%@", ex.reason);
    resolve(@"error syncing contacts");
  }
  
}

-(void) syncContactsInternal
{
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
  [self refreshContacts:addressBookRef];
}

-(void) refreshContacts:(ABAddressBookRef) addressBookRef
{
  
  if(!addressBookRef){
    return;
  }
  NSNumber *lastContactSyncTime = [self getLastContactSyncTime];
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
  [self updateThreadWithChangedContacts:changedContacts];
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
        [self syncContactsInternal];
        break;
      }
        
      default:
        break;
    }
}


-(void) saveChangedContacts:(NSArray*) changedContacts
{
  NSString* insertSqlStmt = @"INSERT OR IGNORE into Contact (phoneNumber, firstName, lastName, displayName, abRecordIdLink, lastModifiedTime) values "
  "(:phoneNumber,:firstName,:lastName,:displayName,:abRecordIdLink,:lastModifiedTime)";
  
  NSString* updateSqlStmt = @"UPDATE Contact SET firstName=:firstName, lastName=:lastName, displayName=:displayName,abRecordIdLink=:abRecordIdLink,lastModifiedTime=:lastModifiedTime   where phoneNumber=:phoneNumber";
  
  NSNumber *currentTime = [NSNumber numberWithLongLong:[[NSDate date] timeIntervalSince1970] * 1000];
  NSString* countryCode = [self getCountryCode];
  NSString* dbPath = [self getDBPath:@"messages.db"];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    [db beginTransaction];
    
    for (NSUInteger i = 0; i < changedContacts.count; i++) {
      Contact *contact = changedContacts[i];
      NSString* e164Number = [ContactsSyncer toE164:contact.phoneNumber countryCode:countryCode];
      if(!e164Number){
        continue;
      }
      NSNumber* abRecordID = [NSNumber numberWithInt:(int)contact.recordID];
      NSMutableDictionary *params = [NSMutableDictionary dictionary];
      [params setObject:e164Number forKey:@"phoneNumber"];
      [params setObject:contact.firstName forKey:@"firstName"];
      [params setObject:contact.lastName forKey:@"lastName"];
      [params setObject:contact.displayName forKey:@"displayName"];
      [params setObject:abRecordID forKey:@"abRecordIdLink"];
      [params setObject:currentTime forKey:@"lastModifiedTime"];
      
      NSLog(@"ready to update contact %@", contact.phoneNumber);
      [db executeUpdate:insertSqlStmt withParameterDictionary:params];
      [db executeUpdate:updateSqlStmt withParameterDictionary:params];
    }
    
    [db commit];
  }];
  
}

-(void) updateThreadWithChangedContacts:(NSArray*) changedContacts
{
  NSString* updateSqlStmt = @"UPDATE Thread SET displayName=:displayName where recipientPhoneNumber=:phoneNumber";
  
  NSString* dbPath = [self getDBPath:@"messages.db"];
  NSString* countryCode = [self getCountryCode];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  [queue inDatabase:^(FMDatabase *db) {
    [db beginTransaction];
    for (NSUInteger i = 0; i < changedContacts.count; i++) {
      Contact *contact = changedContacts[i];
      NSString* e164Number = [ContactsSyncer toE164:contact.phoneNumber countryCode:countryCode];
      if(!e164Number){
        continue;
      }
      NSMutableDictionary *params = [NSMutableDictionary dictionary];
      [params setObject:e164Number forKey:@"phoneNumber"];
      [params setObject:contact.displayName forKey:@"displayName"];
      
      [db executeUpdate:updateSqlStmt withParameterDictionary:params];
    }
    [db commit];
  }];

}

- (NSString *)getDBPath:(NSString *)dbName
{
  NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDir = [docPaths objectAtIndex:0];
  NSString *dbPath = [documentsDir   stringByAppendingPathComponent:dbName];
  NSLog(@"DB path is%@", dbPath);
  return dbPath;
}

-(NSNumber*) getLastContactSyncTime{
  NSString* dbPath = [self getDBPath:@"messages.db"];
  NSString* sqlStmt = @"SELECT value from Preferences where key = 'lastContactSyncTime'";
  __block long long lastSync = 0;
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  [queue inDatabase:^(FMDatabase *db) {
    FMResultSet *rs = [db executeQuery:sqlStmt];
    if ([rs next]) {
      //[results addObject:[rs resultDictionary]];
      lastSync = [rs longLongIntForColumnIndex:0];
    };
    [rs close];
  }];
  
  NSNumber *lastSyncTime = [NSNumber numberWithLongLong:lastSync];
  return lastSyncTime;
}

-(void) updateLastContactSyncTime:(NSNumber*) contactSyncTime{
  NSString* dbPath = [self getDBPath:@"messages.db"];
  NSString* sqlStmt = @"INSERT OR REPLACE INTO Preferences (key,value) values (:key,:value)";
  NSMutableDictionary *params = [NSMutableDictionary dictionary];
  [params setObject:@"lastContactSyncTime" forKey:@"key"];
  [params setObject:contactSyncTime forKey:@"value"];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  [queue inDatabase:^(FMDatabase *db) {
     [db executeUpdate:sqlStmt withParameterDictionary:params];
  }];
}

-(NSString*) getCountryCode{
  NSString* dbPath = [self getDBPath:@"messages.db"];
  NSString* sqlStmt = @"SELECT value from Preferences where key = 'countryCode'";
  __block NSString* countryCode;
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    FMResultSet *rs = [db executeQuery:sqlStmt];
    if ([rs next]) {
       countryCode = [rs stringForColumnIndex:0];
    }
    [rs close];
  }];
  
  return countryCode;
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
    
  }@catch(NSException *ex){
    NSLog(@"Unexpected phone parse error: %@ - %@", phoneNumberStr, ex.reason);
  }
  return e164Number;
}

@end
