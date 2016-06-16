#import <Foundation/Foundation.h>
/**
 *
 * Contact represents relevant information related to a contact from the user's contact list.
 *
 */

@interface ContactUtils : NSObject

+ (NSString*) toE164:(NSString*) phoneNumberStr countryCode:(NSString*) countryCode;

+ (NSString*) getDisplayName:(NSString*)firstName lastName:(NSString*)lastName;

+ (NSString*) removeNonAlphaNumericChars:(NSString*) inputString;

@end