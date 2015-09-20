//
//  RNMQTTClient.h
//  stitchchat
//
//  Created by Ramsundar Kuppusamy on 9/15/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"
#import "MQTTSessionManager.h"

#ifndef stitchchat_RNMQTTClient_h
#define stitchchat_RNMQTTClient_h
#endif

@interface RNMQTTClient : NSObject<MQTTSessionManagerDelegate, RCTBridgeModule>

@end