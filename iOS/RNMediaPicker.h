#import <Foundation/Foundation.h>
#import "RCTBridge.h"
#import "RCTBridgeModule.h"
#import <CTAssetsPickerController/CTAssetsPickerController.h>

@interface RNMediaPicker : NSObject<CTAssetsPickerControllerDelegate, RCTBridgeModule>

@property (nonatomic, retain) CTAssetsPickerController *mediaPicker;

- (void) showMediaPicker;

@end