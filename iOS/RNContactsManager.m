

#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNContactsManager, NSObject)

RCT_EXTERN_METHOD(initializeContacts:(NSString *)countryCode
                                      resolver:(RCTPromiseResolveBlock)resolve
                                      rejecter:(RCTPromiseRejectBlock)reject)

@end