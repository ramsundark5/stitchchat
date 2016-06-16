#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import "UIColorString.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <DigitsKit/DigitsKit.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "NBPhoneNumberUtil.h"

@interface DigitsLogin : NSObject <RCTBridgeModule>
@end

@implementation DigitsLogin
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authenticateWithDigits:(NSDictionary*)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  DGTAuthenticationConfiguration *configuration = [[DGTAuthenticationConfiguration alloc] initWithAccountFields:DGTAccountFieldsDefaultOptionMask];
  configuration.appearance = [[DGTAppearance alloc] init];
  
  NSString* accentColor = [config valueForKey:@"accentColor"];
  NSString* backgroundColor = [config valueForKey:@"backgroundColor"];
  if(accentColor){
    configuration.appearance.accentColor = [UIColor colorWithString:accentColor];
  }
  if(backgroundColor){
    configuration.appearance.backgroundColor = [UIColor colorWithString:backgroundColor];
  }
  configuration.title = [config valueForKey:@"title"];
  
  Digits *digits = [Digits sharedInstance];
  [digits authenticateWithViewController:nil configuration:configuration completion:^(DGTSession *session, NSError *error) {
    
    if(error != nil){
      reject(@"User cancelled the registration process", nil, error);
    }
    
    else if(session != nil){
      DGTOAuthSigning *oauthSigning = [[DGTOAuthSigning alloc] initWithAuthConfig:digits.authConfig authSession:session];
      NSDictionary *authHeaders = [oauthSigning OAuthEchoHeadersToVerifyCredentials];
      NSMutableDictionary *mutableAuthHeader = [authHeaders mutableCopy];
      [mutableAuthHeader setObject:session.phoneNumber forKey:@"phoneNumber"];
      NSDictionary *authResponse = @{
                             @"authToken": session.authToken,
                             @"authTokenSecret": session.authTokenSecret,
                             @"userId": session.userID,
                             @"providerUrl": authHeaders[@"X-Auth-Service-Provider"],
                             @"authHeader": authHeaders[@"X-Verify-Credentials-Authorization"],
                             @"phoneNumber": session.phoneNumber
                             };
      
     [CrashlyticsKit setUserName:session.phoneNumber];

      resolve(authResponse);
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

@end

