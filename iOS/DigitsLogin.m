#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import <DigitsKit/DigitsKit.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface DigitsLogin : NSObject <RCTBridgeModule>
@end

@implementation DigitsLogin
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startLoginProcess) {
  DGTAppearance *digitsAppearance = [[DGTAppearance alloc] init];
  //digitsAppearance.backgroundColor = [UIColor blackColor];
  //digitsAppearance.accentColor = [UIColor greenColor];
  
  digitsAppearance.headerFont = [UIFont systemFontOfSize:18];
  digitsAppearance.labelFont = [UIFont systemFontOfSize:16];
  digitsAppearance.bodyFont = [UIFont systemFontOfSize:16];
  //digitsAppearance.logoImage = [UIImage imageNamed:yourImageFilename];
  
  Digits *digits = [Digits sharedInstance];
  [self showLoginPage: digits digitsAppearance:digitsAppearance];
  
}

- (void) showLoginPage:(Digits *)digits digitsAppearance:(DGTAppearance *)digitsAppearance
{
  [digits authenticateWithDigitsAppearance:digitsAppearance viewController:nil title:nil completion:^(DGTSession *session, NSError *error) {
    
    if(error != nil && error.code == 1){
      NSString* reason = @"User Cancelled";
      [self.bridge.eventDispatcher sendDeviceEventWithName:@"registrationCancelled"
                                                      body: reason];
    }
    
    if(session != nil){
      [self.bridge.eventDispatcher sendDeviceEventWithName:@"registrationSuccessIOS"
                                                      body:@{@"phoneNumber": session.phoneNumber,
                                                             @"authToken":session.authToken,
                                                             @"authTokenSecret":session.authTokenSecret,
                                                             @"digitsUserId":session.userID}];
    }
    
  }];
}

RCT_EXPORT_METHOD(logout) {
  Digits *digits = [Digits sharedInstance];
  [digits logOut];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

/*
 sample usage
 NSString *hexStr1 = @"123ABC";
 NSString *hexStr2 = @"#123ABC";
 NSString *hexStr3 = @"0x123ABC";
 
 UIColor *color1 = [self getUIColorObjectFromHexString:hexStr1 alpha:.9];
 NSLog(@"UIColor: %@", color1);
 
 UIColor *color2 = [self getUIColorObjectFromHexString:hexStr2 alpha:.9];
 NSLog(@"UIColor: %@", color2);
 
 UIColor *color3 = [self getUIColorObjectFromHexString:hexStr3 alpha:.9];
 NSLog(@"UIColor: %@", color3);
 */

- (UIColor *)getUIColorObjectFromHexString:(NSString *)hexStr alpha:(CGFloat)alpha
{
  // Convert hex string to an integer
  unsigned int hexint = [self intFromHexString:hexStr];
  
  // Create color object, specifying alpha as well
  UIColor *color =
  [UIColor colorWithRed:((CGFloat) ((hexint & 0xFF0000) >> 16))/255
                  green:((CGFloat) ((hexint & 0xFF00) >> 8))/255
                   blue:((CGFloat) (hexint & 0xFF))/255
                  alpha:alpha];
  
  return color;
}

- (unsigned int)intFromHexString:(NSString *)hexStr
{
  unsigned int hexInt = 0;
  
  // Create scanner
  NSScanner *scanner = [NSScanner scannerWithString:hexStr];
  
  // Tell scanner to skip the # character
  [scanner setCharactersToBeSkipped:[NSCharacterSet characterSetWithCharactersInString:@"#"]];
  
  // Scan hex value
  [scanner scanHexInt:&hexInt];
  
  return hexInt;
}

@end

