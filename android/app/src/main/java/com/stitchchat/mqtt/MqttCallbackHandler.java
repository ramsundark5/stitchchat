/*******************************************************************************
 * Copyright (c) 1999, 2014 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution. 
 *
 * The Eclipse Public License is available at 
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at 
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 */
package com.stitchchat.mqtt;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

/**
 * Handles call backs from the MQTT Client
 *
 */
public class MqttCallbackHandler implements MqttCallback {

  /** {@link Context} for the application used to format and import external strings**/
  private ReactApplicationContext reactApplicationContext;
  /** Client handle to reference the connection that this handler is attached to**/
  private String clientHandle;

  /**
   * Creates an <code>MqttCallbackHandler</code> object
   * @param reactApplicationContext The application's context
   * @param clientHandle The handle to a {@link Connection} object
   */
  public MqttCallbackHandler(ReactApplicationContext reactApplicationContext, String clientHandle)
  {
    this.reactApplicationContext = reactApplicationContext;
    this.clientHandle = clientHandle;
  }

  /**
   * @see MqttCallback#connectionLost(Throwable)
   */
  @Override
  public void connectionLost(Throwable cause) {
    Log.e(this.getClass().getCanonicalName(),
            "connection lost ");
    this.reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onConnectionLost", "connection lost ");
  }

  /**
   * @see MqttCallback#messageArrived(String, MqttMessage)
   */
 /* @Override
  public void messageArrived(String topic, MqttMessage message) throws Exception {

    String parsedMessage = new String(message.getPayload());
    Log.d(this.getClass().getCanonicalName(),
            "Message arrived with data: " + parsedMessage);
    this.reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onMessageArrived", parsedMessage);
  }*/

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String parsedMessage = new String(message.getPayload());
        Log.d(this.getClass().getCanonicalName(),
                "Message arrived with data: " + parsedMessage);
        WritableMap params = new WritableNativeMap();
        params.putString("data", parsedMessage);
        sendEvent(this.reactApplicationContext, "onMessageReceived", parsedMessage);
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
  /**
   * @see MqttCallback#deliveryComplete(IMqttDeliveryToken)
   */
  @Override
  public void deliveryComplete(IMqttDeliveryToken token) {
    this.reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onDeliveryComplete", token.getMessageId());
  }

}
