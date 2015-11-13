#import "RNMediaPicker.h"
#import "AppDelegate.h"

@implementation RNMediaPicker

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(showMediaPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  self.resolve = resolve;
  self.reject  = reject;
  [self showMediaPickerInternal];
}

-(void)showMediaPickerInternal {
  if(self.mediaPicker == nil) {
    self.mediaPicker = [[GMImagePickerController alloc] init];
  }
  
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  
  [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status){
    dispatch_async(dispatch_get_main_queue(), ^{
      
      // init picker
      GMImagePickerController *picker = [[GMImagePickerController alloc] init];
      picker.title = @"Gallery";
      picker.customNavigationBarPrompt = @"Next";
      
      // set delegate
      picker.delegate = self;
      
      // Optionally present picker as a form sheet on iPad
      if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
        picker.modalPresentationStyle = UIModalPresentationFormSheet;
      
      // present picker
      [delegate.rootViewController presentViewController:picker animated:YES completion:nil];
    });
  }];
}

- (void)assetsPickerController:(GMImagePickerController *)picker didFinishPickingAssets:(NSArray *)assets
{
  // assets contains PHAsset objects.
  hideMediaPicker();
  //self.resolve(assets);
}


#pragma mark private-methods

void hideMediaPicker() {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
