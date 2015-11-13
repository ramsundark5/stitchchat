#import <Foundation/Foundation.h>
#import "RCTBridge.h"
#import "RCTBridgeModule.h"
#import "GMImagePickerController.h"

@interface RNMediaPicker : NSObject<GMImagePickerControllerDelegate, RCTBridgeModule>

@property (nonatomic, retain) GMImagePickerController *mediaPicker;
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;

- (void) showMediaPicker:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject;

@end