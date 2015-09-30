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
  Digits *digits = [Digits sharedInstance];
  [digits authenticateWithDigitsAppearance:digitsAppearance viewController:nil title:nil completion:^(DGTSession *session, NSError *error) {
    
    // Inspect session/error objects
     [self.bridge.eventDispatcher sendDeviceEventWithName:@"loginSuccess" body:session.phoneNumber];
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

