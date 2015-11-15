#import <Foundation/Foundation.h>
#import "RCTBridge.h"
#import "RCTBridgeModule.h"
#import <CTAssetsPickerController/CTAssetsPickerController.h>


@interface RNMediaPicker : NSObject<CTAssetsPickerControllerDelegate, RCTBridgeModule>

@property (nonatomic, retain) CTAssetsPickerController *mediaPicker;
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;

- (void) showMediaPicker:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject;

@end