#import <Foundation/Foundation.h>
#import <AddressBook/AddressBook.h>
#import <UIKit/UIKit.h>
/**
 *
 * Contact represents relevant information related to a contact from the user's contact list.
 *
 */

@interface Contact : NSObject

@property (readonly,nonatomic) NSString   *firstName;
@property (readonly,nonatomic) NSString   *lastName;
@property (readonly,nonatomic) NSString   *displayName;
@property (readonly,nonatomic) NSString   *phoneNumber;
@property (readonly,nonatomic) UIImage    *image;
@property (readonly,nonatomic) ABRecordID recordID;

+ (Contact*)contactWithFirstName:(NSString*)firstName
                     andLastName:(NSString *)lastName
         andPhoneNumber:(NSString*)phoneNumbers
                       andImage:(UIImage *)image
                    andContactID:(ABRecordID)record;

@end