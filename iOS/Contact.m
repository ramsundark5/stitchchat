#import "Contact.h"

@implementation Contact

@synthesize firstName, lastName, image, displayName, recordID, phoneNumber;

+ (Contact*)contactWithFirstName:(NSString*)firstName
                     andLastName:(NSString *)lastName
                  andPhoneNumber:(NSString*)phoneNumber
                        andImage:(UIImage *)image
                    andContactID:(ABRecordID)record {
  
  Contact* contact = [Contact new];
  contact->firstName = firstName;
  contact->lastName = lastName;
  contact->phoneNumber = phoneNumber;
  contact->recordID = record;
  
  NSMutableString *fullName = [NSMutableString string];
  if (firstName) [fullName appendString:firstName];
  if (lastName) {
    [fullName appendString:[NSString stringWithFormat:@" %@",lastName]];
  }
  contact->displayName = fullName;
  
  return contact;
}

@end