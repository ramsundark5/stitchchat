

#import <Foundation/Foundation.h>

#import "RNMQTTClient.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@import UIKit.UIPasteboard;

@interface RNMQTTClient ()
/*
 * MQTTClient: keep a strong reference to your MQTTSessionManager here
 */
@property (strong, nonatomic) MQTTSessionManager *manager;
@property (strong, nonatomic) NSDictionary *mqttSettings;
@end

@implementation RNMQTTClient
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(connect:(NSString *)host port:(NSInteger)port)
{
  
  NSString* topicName = @"MQTTChatReceive";
  /*
   * MQTTClient: create an instance of MQTTSessionManager once and connect
   * will is set to let the broker indicate to other subscribers if the connection is lost
   */
  if (!self.manager) {
    self.manager = [[MQTTSessionManager alloc] init];
    self.manager.delegate = self;
    self.manager.subscriptions = [[NSMutableDictionary alloc] init];
    [self.manager.subscriptions setObject:[NSNumber numberWithInt:MQTTQosLevelAtLeastOnce]
                                   forKey: topicName];
    [self.manager connectTo:host
                       port:port
                        tls:FALSE
                  keepalive:60
                      clean:true
                       auth:false
                       user:nil
                       pass:nil
                  willTopic:[NSString stringWithFormat:@"%@/%@",
                             @"example/12345",
                             [UIDevice currentDevice].name]
                       will:[@"offline" dataUsingEncoding:NSUTF8StringEncoding]
                    willQos:MQTTQosLevelAtLeastOnce
             willRetainFlag:FALSE
               withClientId:nil];
  } else {
    [self.manager connectToLast];
  }
  
  /*
   * MQTTCLient: observe the MQTTSessionManager's state to display the connection status
   */
  
  [self.manager addObserver:self
                 forKeyPath:@"state"
                    options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                    context:nil];
  
}


RCT_EXPORT_METHOD(send:(NSString*)message
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  [self.manager sendData:[message dataUsingEncoding:NSUTF8StringEncoding]
                   topic: @"MQTTChat"
                     qos:MQTTQosLevelAtLeastOnce
                  retain:FALSE];
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

/*
 * MQTTSessionManagerDelegate
 */
- (void)handleMessage:(NSData *)data onTopic:(NSString *)topic retained:(BOOL)retained {
  /*
   * MQTTClient: process received message
   */
  
  NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  NSLog(@"MQTTSession received data");
  [self.bridge.eventDispatcher sendAppEventWithName:@"onMessageReceived"
                                               body:@{@"data": dataString}];
  
}

RCT_EXPORT_METHOD(disconnect:(id)sender) {
  [self.manager disconnect];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
  switch (self.manager.state) {
    case MQTTSessionManagerStateClosed:
      NSLog(@"MQTTSession is closed");
      break;
    case MQTTSessionManagerStateClosing:
      NSLog(@"MQTTSession is closing");
      break;
    case MQTTSessionManagerStateConnected:
      NSLog(@"MQTTSession connected");
      break;
    case MQTTSessionManagerStateConnecting:
      NSLog(@"MQTTSession still connecting");
      break;
    case MQTTSessionManagerStateError:
      NSLog(@"MQTTSession errored out");
      break;
    case MQTTSessionManagerStateStarting:
    default:
      NSLog(@"MQTTSession is starting");
      break;
  }
}

/** Always run on main queue. Else MQTT is not able to maintain live connection.*/
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
  //can't get it to work off of main queue. this needs to be fixed.
  //return dispatch_queue_create("net.stitchchat.MQTTClient", DISPATCH_QUEUE_SERIAL);
}

@end