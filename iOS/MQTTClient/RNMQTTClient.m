

#import <Foundation/Foundation.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTBridgeModule.h"
#import "MQTTSessionManager.h"
#import "RCTConvert.h"

@interface RNMQTTClient : NSObject<MQTTSessionManagerDelegate, RCTBridgeModule>
/*
 * MQTTClient: keep a strong reference to your MQTTSessionManager here
 */
@property (strong, nonatomic) MQTTSessionManager *manager;
@property (strong, nonatomic) NSDictionary *mqttSettings;
@property (nonatomic, strong) id statusObserver;
@end

@implementation RNMQTTClient
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();


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
  
  /*
   * MQTTClient: create an instance of MQTTSessionManager once and connect
   * will is set to let the broker indicate to other subscribers if the connection is lost
   */
  if (!self.manager) {
      /*BOOL enablePersistence = TRUE;
      NSUInteger maxWindowSize = 60;
      NSUInteger maxMessages = 500;
      NSUInteger maxSize = 5000;
    
      self.manager = [[MQTTSessionManager alloc] initWithPersistence:enablePersistence maxWindowSize:maxWindowSize maxMessages:maxMessages maxSize:maxSize];*/
    
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
                    options:0
                    context:NULL];
  
  [self subscribeTo:topicName qosLevel:qosLevel];
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
  
  NSMutableDictionary *newSubscriptions = [self.manager.subscriptions mutableCopy];
  [newSubscriptions setObject:[NSNumber numberWithInt:qosLevel]
                                 forKey: topicName];
  [self.manager setSubscriptions: newSubscriptions];
}

/*
 * MQTTSessionManagerDelegate
 */
- (void)handleMessage:(NSData *)data onTopic:(NSString *)topic retained:(BOOL)retained {
    NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"onMessageReceived"
                                               body:@{@"data": dataString}];
  
}

-(void) messageDelivered:(UInt16)msgID{
  NSNumber *msgIDPtr = [NSNumber numberWithInteger: msgID];
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"onPublishedAck"
                                                  body:msgIDPtr];

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
          break;
        case MQTTSessionManagerStateConnected:
          [self.bridge.eventDispatcher sendDeviceEventWithName:@"onMQTTConnected"
                                                        body:@"Connected succesfully"];
          NSLog(@"MQTTSession connected");
          break;
        case MQTTSessionManagerStateConnecting:
          break;
        case MQTTSessionManagerStateError:
          NSLog(@"MQTTSession errored out");
          break;
        case MQTTSessionManagerStateStarting:
        default:
          break;
    }
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
  
  self.manager.delegate = nil;
  [self.manager removeObserver:self forKeyPath:@"state" context:nil];
}

@end