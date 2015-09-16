

#import <Foundation/Foundation.h>

#import "RNMQTTClient.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@import UIKit.UIPasteboard;

@interface RNMQTTClient ()
/*
 * MQTTClient: keep a strong reference to your MQTTSessionManager here
 */
@property (strong, nonatomic) MQTTSession *session;
@property (strong, nonatomic) NSDictionary *mqttSettings;
@end

@implementation RNMQTTClient
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(connect:(NSString *)host port:(NSInteger)port)
{
  NSString* topicName = @"MQTTChatReceive";
  
  NSString *uuidString = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  self.session = [[MQTTSession alloc] initWithClientId:uuidString];
  self.session.delegate = self;
  self.session.keepAliveInterval = 61000;
  self.session.cleanSessionFlag = YES;
  
  [self.session connectToHost:host port:1883 usingSSL:NO];
  [self.session subscribeToTopic:topicName atLevel:MQTTQosLevelExactlyOnce];
}

RCT_EXPORT_METHOD(send:(NSString*)message
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [self.session publishData:[message dataUsingEncoding:NSUTF8StringEncoding]
                    onTopic:@"MQTTChat"
                     retain:NO
                        qos:MQTTQosLevelAtLeastOnce];
  if (message) {
    resolve(message);
  }
}

- (void)newMessage:(MQTTSession *)session
              data:(NSData *)data
           onTopic:(NSString *)topic
               qos:(MQTTQosLevel)qos
          retained:(BOOL)retained
               mid:(unsigned int)mid{
  
  NSString *contents = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  [self.bridge.eventDispatcher sendAppEventWithName:@"onMessageReceived"
                                               body:@{@"data": contents}];
  
  
}
- (void)handleMessage:(NSData *)data onTopic:(NSString *)topic retained:(BOOL)retained {
  
  NSString *contents = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  [self.bridge.eventDispatcher sendAppEventWithName:@"onMessageReceived"
                                               body:@{@"data": contents}];
}

@end