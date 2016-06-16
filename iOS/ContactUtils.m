#import "ContactUtils.h"
#import "NBPhoneNumberUtil.h"

@implementation ContactUtils

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

+(NSString*) getDisplayName:(NSString*)firstName
                   lastName:(NSString*)lastName{
  NSMutableString *fullName = [NSMutableString string];
  if (firstName) [fullName appendString:firstName];
  if (lastName) {
    [fullName appendString:[NSString stringWithFormat:@" %@",lastName]];
  }
  return fullName;
}

+(NSString*) removeNonAlphaNumericChars:(NSString*) inputString{
  NSString *cleanedUpOutput = @"";
  
  if(inputString){
    NSCharacterSet *charactersToRemove = [[NSCharacterSet alphanumericCharacterSet] invertedSet];
    cleanedUpOutput = [[inputString componentsSeparatedByCharactersInSet:charactersToRemove] componentsJoinedByString:@""];
  }
  return cleanedUpOutput;
}

@end