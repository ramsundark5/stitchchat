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
#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface RNMQTTClient : NSObject<MQTTSessionManagerDelegate, RCTBridgeModule>
@property(strong, nonatomic)MQTTSessionManager *manager;
@property (strong, nonatomic) NSDictionary *mqttSettings;

@end
