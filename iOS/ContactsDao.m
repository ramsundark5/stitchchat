@import Contacts;
#import <Foundation/Foundation.h>

#import "FMDB.h"
#import "ContactsDao.h"
#import "NBPhoneNumberUtil.h"

@implementation ContactsDao

-(BOOL) saveContactsToDB:(NSString*) countryCode contacts:(NSArray *)contacts
{
   NSString* sqlStmt = @"INSERT into Contact (phoneNumber, firstName, lastName, displayName, "
                      "phoneLabel, localContactIdLink, lastModifiedTime) values "
                      "(:phoneNumber,:firstName,:lastName,:displayName,:phoneLabel, "
                      ":localContactIdLink,:lastModifiedTime)";
  
  __block BOOL saveSuccess = FALSE;
  NSString* dbPath = [self getDBPath:@"contacts.db"];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    [db beginTransaction];
    
    @try {
      saveSuccess = [self saveContactToDBInternal:countryCode contacts:contacts sqlStmt:sqlStmt db:db];
    } @catch (NSError *error) {
      NSLog(@"Error initializing contacts%@", error.localizedDescription);
    }
    
    [db commit];
  }];

  return saveSuccess;
}

-(BOOL) saveContactToDBInternal:(NSString*)countryCode
                       contacts:(NSArray *)contacts
                        sqlStmt:(NSString*)sqlStmt
                             db:(FMDatabase*)db
{
  BOOL saveSuccess = FALSE;
  for (CNContact *contact in contacts)
  {
      BOOL isPhoneNumberAvailable = [contact isKeyAvailable:CNContactPhoneNumbersKey];
      if(!isPhoneNumberAvailable){
        //we are interested only in contacts with phone numbers
        continue;
      }
    
      NSArray <CNLabeledValue<CNPhoneNumber *> *> *phoneNumbers = contact.phoneNumbers;
      NSNumber *currentTime = [NSNumber numberWithLongLong:[[NSDate date] timeIntervalSince1970] * 1000];
      for (CNLabeledValue* phoneNumberDict in phoneNumbers)
      {
        @try {
          CNPhoneNumber* cnPhoneNumber = phoneNumberDict.value;
          NSString* phoneLabel  = phoneNumberDict.label;
          NSString* phoneNumber = cnPhoneNumber.stringValue;
          NSString* e164Number  = [ContactsDao toE164:phoneNumber countryCode:countryCode];
            
          if(!e164Number){
            continue;
          }
            
          NSString* displayName = contact.givenName;
          
          if(contact.familyName){
            displayName = [displayName stringByAppendingString:contact.familyName];
          }
          NSString *cleanedUpPhoneLabel = @"";
          
          if(phoneLabel){
            NSCharacterSet *charactersToRemove = [[NSCharacterSet alphanumericCharacterSet] invertedSet];
            cleanedUpPhoneLabel = [[phoneLabel componentsSeparatedByCharactersInSet:charactersToRemove] componentsJoinedByString:@""];
          }
          
          NSDictionary *params = [NSDictionary dictionaryWithObjectsAndKeys:
                                  e164Number, @"phoneNumber",
                                  contact.givenName, @"firstName",
                                  contact.familyName, @"lastName",
                                  displayName, @"displayName",
                                  cleanedUpPhoneLabel, @"phoneLabel",
                                  contact.identifier, @"localContactIdLink",
                                  currentTime, @"lastModifiedTime",
                                  nil];
                                  //contact.emailAddresses, @"email",
                                  //contact.familyName, @"phoneType",
                                  //abRecordIdLink, @"abRecordIdLink",
                                  //photo, @"photo",
                                  //contact., @"thumbNailPhoto",
          
          
          [db executeUpdate:sqlStmt withParameterDictionary:params];
        }
        @catch (NSError *error) {
          NSLog(@"Error saving contact %@", error.localizedDescription);
        }

        
      }
    
    saveSuccess = TRUE;
  }

  return saveSuccess;
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
