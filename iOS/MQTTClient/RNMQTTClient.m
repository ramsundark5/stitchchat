

#import <Foundation/Foundation.h>

#import "RNMQTTClient.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"

@implementation RNMQTTClient
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (id)init{
  self = [super init];
  return self;
}

RCT_EXPORT_METHOD(connect:(NSDictionary *)connectionDetails
                          topicName:(NSString*) topicName
                          qosLevel:(NSInteger) qosLevel)
{
  
  NSString *host          = [RCTConvert NSString:connectionDetails[@"host"]];
  NSInteger port          = [RCTConvert NSInteger:connectionDetails[@"port"]];
  BOOL      tls           = [RCTConvert BOOL:connectionDetails[@"tls"]];
  NSInteger keepAlive     = [RCTConvert NSInteger:connectionDetails[@"keepAlive"]];
  BOOL cleanSession       = [RCTConvert BOOL:connectionDetails[@"cleanSession"]];
  BOOL auth               = [RCTConvert BOOL:connectionDetails[@"auth"]];
  NSString *user          = [RCTConvert NSString:connectionDetails[@"username"]];
  NSString *password      = [RCTConvert NSString:connectionDetails[@"password"]];
  NSString *willTopic     = [RCTConvert NSString:connectionDetails[@"willTopic"]];
  NSString *willMessage   = [RCTConvert NSString:connectionDetails[@"willMessage"]];
  NSInteger willQos       = [RCTConvert NSInteger:connectionDetails[@"willQos"]];
  BOOL willRetainFlag     = [RCTConvert BOOL:connectionDetails[@"willRetainFlag"]];
  NSString *clientId      = [RCTConvert NSString:connectionDetails[@"clientId"]];

  NSData* encodedWillMessage = nil;
  
  //set default willTopic and willMessage if not defined
  if( willTopic == (id)[NSNull null] || willTopic.length <= 0 ){
    willTopic = [NSString stringWithFormat:@"%@/%@",
                 [UIDevice currentDevice].name,
                 @"status"];
  }
  if ( willMessage == (id)[NSNull null] || willMessage.length <= 0 ){
    willMessage = @"offline";
    encodedWillMessage = [willMessage dataUsingEncoding:NSUTF8StringEncoding];
  }
  
  if(keepAlive <= 0){
    keepAlive = 60;
  }
  
  [self subscribeTo:topicName qosLevel:qosLevel];
  
  /*
   * MQTTClient: create an instance of MQTTSessionManager once and connect
   * will is set to let the broker indicate to other subscribers if the connection is lost
   */
  if (!self.manager) {
      self.manager = [[MQTTSessionManager alloc] init];
      self.manager.delegate = self;
      self.manager.subscriptions = [[NSMutableDictionary alloc] init];
    
      [self.manager connectTo:host
                       port:port
                          tls:tls
                    keepalive:keepAlive
                        clean:cleanSession
                         auth:auth
                         user:user
                         pass:password
                    willTopic:willTopic
                         will:encodedWillMessage
                      willQos:willQos
               willRetainFlag:willRetainFlag
                 withClientId:clientId];
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


RCT_EXPORT_METHOD(publish:(NSString*)topicName
                  message:(NSString*) message
                  qosLevel:(NSInteger) qosLevel
                  retain:(BOOL) retain
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  UInt16 msgId = [self.manager sendData:[message dataUsingEncoding:NSUTF8StringEncoding]
                   topic: topicName
                     qos:qosLevel
                  retain:retain];
  
  NSNumber *messageId = [NSNumber numberWithUnsignedInt:msgId];
  
  resolve(messageId);
  
}

RCT_EXPORT_METHOD(subscribeTo:(NSString*) topicName
                            qosLevel:(NSInteger) qosLevel) {
  
  [self.manager.subscriptions setObject:[NSNumber numberWithInt:qosLevel]
                                 forKey: topicName];

}

/*
 * MQTTSessionManagerDelegate
 */
- (void)handleMessage:(NSData *)data onTopic:(NSString *)topic retained:(BOOL)retained {
  /*
   * MQTTClient: process received message
   */
  
    NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"onMessageReceived"
                                               body:@{@"data": dataString}];
  
}

RCT_EXPORT_METHOD(initWithPersistence:(BOOL)persistent
                              maxWindowSize:(NSUInteger)maxWindowSize
                                maxMessages:(NSUInteger)maxMessages
                                    maxSize:(NSUInteger)maxSize) {
  
  self.manager = [[MQTTSessionManager alloc] initWithPersistence:persistent
                                                   maxWindowSize:maxWindowSize
                                                     maxMessages:maxMessages
                                                         maxSize:maxSize];
}

RCT_EXPORT_METHOD(disconnect:(id)sender) {
    [self.manager disconnect];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change
                        context:(void *)context {
  
    switch (self.manager.state) {
        case MQTTSessionManagerStateClosed:
        [self.bridge.eventDispatcher sendDeviceEventWithName:@"onMQTTDisconnected"
                                                        body:@"Disonnected succesfully"];
          NSLog(@"MQTTSession is closed");
          break;
        case MQTTSessionManagerStateClosing:
          //NSLog(@"MQTTSession is closing");
          break;
        case MQTTSessionManagerStateConnected:
         [self.bridge.eventDispatcher sendDeviceEventWithName:@"onMQTTConnected"
                                                        body:@"Connected succesfully"];
          NSLog(@"MQTTSession connected");
          break;
        case MQTTSessionManagerStateConnecting:
          //NSLog(@"MQTTSession still connecting");
          break;
        case MQTTSessionManagerStateError:
          NSLog(@"MQTTSession errored out");
          break;
        case MQTTSessionManagerStateStarting:
        default:
          //NSLog(@"MQTTSession is starting");
          break;
    }
  
    NSNumber* newStatusVal = [NSNumber numberWithInt:self.manager.state];
    [self onStatusChanged: newStatusVal];
}

-(void) onStatusChanged:(NSNumber *) newStatus{
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"onConnectionStatusChanged"
                                               body:newStatus];
}

/** Always run on main queue. Else MQTT is not able to maintain live connection.*/
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
  //can't get it to work off of main queue. this needs to be fixed.
  //return dispatch_queue_create("net.stitchchat.MQTTClient", DISPATCH_QUEUE_SERIAL);
}

- (void)dealloc {
  [self.manager removeObserver:self forKeyPath:@"state"];
}

@end