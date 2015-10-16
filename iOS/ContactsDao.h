@import Contacts;
#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"
#import "FMDB.h"

@interface ContactsDao : NSObject

-(BOOL) saveContactsToDB:(NSArray *)contacts;

@end
