//
//  Hello.swift
//  stitchchat
//
//  Created by Ramsundar Kuppusamy on 9/11/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

import Foundation

@objc(HelloManager)
class HelloManager: NSObject {
  
  @objc func sayHello(name: String,
                      resolver resolve: RCTPromiseResolveBlock,
                      rejecter reject : RCTPromiseRejectBlock) -> Void {
    let output = name + "Ram"
    /*let resultsDict = [
                      "success"  : true,
                      "contents" : output
                      ];*/
    // Date is ready to use!
    //return output
    resolve(output)
  }
  
}