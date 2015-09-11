//
//  HelloManager.m
//  stitchchat
//
//  Created by Ramsundar Kuppusamy on 9/11/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(HelloManager, NSObject)

RCT_EXTERN_METHOD(sayHello:(NSString *)name
                  //callback:(RCTResponseSenderBlock *)successCallback)
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end