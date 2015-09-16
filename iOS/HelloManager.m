

#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(HelloManager, NSObject)

RCT_EXTERN_METHOD(sayHello:(NSString *)name
                  //callback:(RCTResponseSenderBlock *)successCallback)
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end