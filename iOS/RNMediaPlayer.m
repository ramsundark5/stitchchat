//
//  RNMediaPlayer.m
//  RNMediaPlayer
//
//  Created by Chris Elly on 2015.07.12
//

#import "RNMediaPlayer.h"
#import "RCTLog.h"
#import "RCTConvert.h"
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>
#import <Photos/Photos.h>
#import "RCTUtils.h"

@implementation RNMediaPlayer
{
  AVPlayer *_player;
  AVPlayerViewController *_playerViewcontroller;
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(open:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // this method can receive the following options
  //
  // uri: STRING (full resource name with file extension)
  //
  // missing: option to disable autoplay

  NSString *mediaUri = [options objectForKey:@"uri"];

  PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[mediaUri] options:nil];
  if (results.count == 0) {
    NSString *errorText = [NSString stringWithFormat:@"Failed to fetch PHAsset with local identifier %@ with no error message.", mediaUri];
    NSError *error = RCTErrorWithMessage(errorText);
    reject(errorText, nil, error);
  }
  
  PHAsset *videoAsset = [results firstObject];
  
  PHVideoRequestOptions *videoOptions = [PHVideoRequestOptions new];
  videoOptions.deliveryMode = PHVideoRequestOptionsDeliveryModeFastFormat;
  
  [[PHImageManager defaultManager] requestPlayerItemForVideo:videoAsset options:videoOptions resultHandler:^(AVPlayerItem * playerItem, NSDictionary * info) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
      
      AVPlayerViewController *playerViewController = [[AVPlayerViewController alloc] init];
      
      playerViewController.player = [AVPlayer playerWithPlayerItem:playerItem];
      playerViewController.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
      // autoplay
      [playerViewController.player play];
      
      _playerViewcontroller = playerViewController;
      
      UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
      UIView *view = [ctrl view];
      
      view.window.windowLevel = UIWindowLevelStatusBar;
      
      [ctrl presentViewController:playerViewController animated:TRUE completion: nil];
      resolve(@"started native video player");
    });

  }];

}

@end
