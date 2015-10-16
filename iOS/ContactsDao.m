@import Contacts;
#import <Foundation/Foundation.h>

#import "FMDB.h"
#import "ContactsDao.h"

@implementation ContactsDao

-(BOOL) saveContactsToDB:(NSArray *)contacts
{
   NSString* sqlStmt = @"INSERT into Contact (firstName, lastName, displayName, "
                      "phoneLabel, phoneNumber, localContactIdLink, lastModifiedTime) values "
                      "(:firstName,:lastName,:displayName,:phoneLabel, "
                      ":phoneNumber,:localContactIdLink,:lastModifiedTime)";
  

  NSString* dbPath = [self getDBPath:@"contacts.db"];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    [db beginTransaction];
    
    @try {
      [self saveContactToDBINternal:contacts sqlStmt:sqlStmt db:db];
    } @catch (NSError *error) {
      NSLog(@"Error initializing contacts%@", error.localizedDescription);
    }
    
    [db commit];
  }];

  return TRUE;
}

-(BOOL) saveContactToDBINternal:(NSArray *)contacts
                        sqlStmt:(NSString*)sqlStmt
                             db:(FMDatabase*)db
{
  for (CNContact *contact in contacts)
  {
    NSArray <CNLabeledValue<CNPhoneNumber *> *> *phoneNumbers = contact.phoneNumbers;
    
      for (CNLabeledValue* phoneNumberDict in phoneNumbers)
      {
        @try {
          CNPhoneNumber* cnPhoneNumber = phoneNumberDict.value;
          NSString* phoneLabel  = phoneNumberDict.label;
          NSString* phoneNumber = cnPhoneNumber.stringValue;
          NSLog(@"phone number is  %@",phoneNumber);
          NSLog(@"phone label is %@",phoneLabel);
          NSString* displayName = contact.givenName;
          if(contact.familyName){
            displayName = [displayName stringByAppendingString:contact.familyName];
          }
          NSNumber *currentTime = [NSNumber numberWithLongLong:[[NSDate date] timeIntervalSince1970] * 1000];;
          //double currentTime = [[NSDate date] timeIntervalSince1970] * 1000;
          
          NSDictionary *params = [NSDictionary dictionaryWithObjectsAndKeys:
                                  contact.givenName, @"firstName",
                                  contact.familyName, @"lastName",
                                  displayName, @"displayName",
                                  phoneLabel, @"phoneLabel",
                                  phoneNumber, @"phoneNumber",
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
  }

  return TRUE;
}

- (NSString *)getDBPath:(NSString *)dbName
{
  NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDir = [docPaths objectAtIndex:0];
  NSString *dbPath = [documentsDir   stringByAppendingPathComponent:dbName];
  
  return dbPath;
}
@end
