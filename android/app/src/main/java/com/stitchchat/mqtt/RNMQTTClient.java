package com.stitchchat.mqtt;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.stitchchat.mqtt.Connection.ConnectionStatus;
import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttSecurityException;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Set;

public class RNMQTTClient extends ReactContextBaseJavaModule{

    private String SSL_CERT_PASSWORD = "mqtttest";
    private String clientHandle;
    private static RNMQTTClient instance;

    public static RNMQTTClient instance(){
        return instance;
    }

    public RNMQTTClient(ReactApplicationContext reactApplicationContext){
        super(reactApplicationContext);
    }

    @ReactMethod
    public void connect(final ReadableMap connectionDetails, String topicName, int qosLevel){
        connectInternal(connectionDetails);
        subscribeTo(topicName, qosLevel);
    }

    public void connectInternal(ReadableMap connectionDetails){

        MqttConnectOptions conOpt = new MqttConnectOptions();
    /*
     * Mutal Auth connections could do something like this
     *
     *
     * SSLContext context = SSLContext.getDefault();
     * context.init({new CustomX509KeyManager()},null,null); //where CustomX509KeyManager proxies calls to keychain api
     * SSLSocketFactory factory = context.getSSLSocketFactory();
     *
     * MqttConnectOptions options = new MqttConnectOptions();
     * options.setSocketFactory(factory);
     *
     * client.connect(options);
     *
     */


        // The basic client information
        String host             = connectionDetails.hasKey(ActivityConstants.host)
                                    ? connectionDetails.getString(ActivityConstants.host) : null;
        int port                = connectionDetails.hasKey(ActivityConstants.port)
                                    ? connectionDetails.getInt(ActivityConstants.port) : null;
        String clientId         = connectionDetails.hasKey(ActivityConstants.clientId)
                                    ? connectionDetails.getString(ActivityConstants.clientId) : null;
        boolean ssl             = connectionDetails.hasKey(ActivityConstants.tls)
                                    ? connectionDetails.getBoolean(ActivityConstants.tls) : null;
        String ssl_key          = connectionDetails.hasKey(ActivityConstants.ssl_key)
                                    ? connectionDetails.getString(ActivityConstants.ssl_key) : null;
        String willMessage      = connectionDetails.hasKey(ActivityConstants.willMessage)
                                    ? connectionDetails.getString(ActivityConstants.willMessage) : null;
        String willTopic        = connectionDetails.hasKey(ActivityConstants.willTopic)
                                    ? connectionDetails.getString(ActivityConstants.willTopic) : null;
        int willQos             = connectionDetails.hasKey(ActivityConstants.willQos)
                                    ? connectionDetails.getInt(ActivityConstants.willQos) : 0;
        boolean willRetainFlag  = connectionDetails.hasKey(ActivityConstants.willRetainFlag)
                                    ? connectionDetails.getBoolean(ActivityConstants.willRetainFlag) : false;
        boolean cleanSession    = connectionDetails.hasKey(ActivityConstants.cleanSession)
                                    ? connectionDetails.getBoolean(ActivityConstants.cleanSession) : false;
        int keepAlive           = connectionDetails.hasKey(ActivityConstants.keepAlive)
                                    ? connectionDetails.getInt(ActivityConstants.keepAlive) : 60;
        String username         = connectionDetails.hasKey(ActivityConstants.username)
                                    ? connectionDetails.getString(ActivityConstants.username) : null;
        String password         = connectionDetails.hasKey(ActivityConstants.password)
                                    ? connectionDetails.getString(ActivityConstants.password) : null;
        int timeout             = connectionDetails.hasKey(ActivityConstants.timeout)
                                    ? connectionDetails.getInt(ActivityConstants.timeout) : 1000;
        int mqttVersion         = connectionDetails.hasKey(ActivityConstants.mqttVersion)
                                    ? connectionDetails.getInt(ActivityConstants.mqttVersion) : 4;
        String uri = null;
        if (ssl) {
            Log.e("SSLConnection", "Doing an SSL Connect");
            uri = "ssl://";
        }
        else {
            uri = "tcp://";
        }

        uri = uri + host + ":" + port;
        // create a client handle
        if(clientId == null){
            //UUID randomClientId = UUID.randomUUID();
            //clientId = randomClientId.toString();
            clientId = "mqttTest";
        }
        clientHandle = uri + clientId;
        //clientHandle = uri;

        MqttAndroidClient client;
        client = Connections.getInstance(getReactApplicationContext()).createClient(getReactApplicationContext(), uri, clientId);

        if (ssl){
            try {
                if(ssl_key != null && !ssl_key.equalsIgnoreCase(""))
                {
                    FileInputStream key = new FileInputStream(ssl_key);
                    conOpt.setSocketFactory(client.getSSLSocketFactory(key,
                            "mqtttest"));
                }

            } catch (MqttSecurityException e) {
                Log.e(this.getClass().getCanonicalName(),
                        "MqttException Occured: ", e);
            } catch (FileNotFoundException e) {
                Log.e(this.getClass().getCanonicalName(),
                        "MqttException Occured: SSL Key file not found", e);
            }
        }

        // connection options
        Connection connection = new Connection(clientHandle, clientId, host, port,
                getReactApplicationContext(), client, ssl);

        // connect client
        conOpt.setMqttVersion(mqttVersion);
        conOpt.setCleanSession(cleanSession);
        conOpt.setConnectionTimeout(timeout);
        conOpt.setKeepAliveInterval(keepAlive);
        if (username != null && !username.equals(ActivityConstants.empty)) {
            conOpt.setUserName(username);
        }
        if (password !=null && !password.equals(ActivityConstants.empty)) {
            conOpt.setPassword(password.toCharArray());
        }
        String[] actionArgs = new String[1];
        actionArgs[0] = clientId;
        connection.changeConnectionStatus(ConnectionStatus.CONNECTING);

        final ActionListener callback = new ActionListener(getReactApplicationContext(),
                ActionListener.Action.CONNECT, clientHandle, actionArgs);

        boolean doConnect = true;

        if ((willMessage != null && !willMessage.equals(ActivityConstants.empty))
                || (willTopic != null && !willTopic.equals(ActivityConstants.empty))) {
            // need to make a message since last will is set
            try {
                conOpt.setWill(willTopic, willMessage.getBytes(), willQos, willRetainFlag);
            }
            catch (Exception e) {
                Log.e(this.getClass().getCanonicalName(), "Exception Occured", e);
                doConnect = false;
                callback.onFailure(null, e);
            }
        }

        client.setCallback(new MqttCallbackHandler(getReactApplicationContext(), clientHandle));
        //client.setCallback(this);
        client.setTraceCallback(new MqttTraceCallback());

        connection.addConnectionOptions(conOpt);
        Connections.getInstance(getReactApplicationContext()).addConnection(connection);
        if (doConnect) {
            try {
                client.connect(conOpt, null, callback);
            }
            catch (MqttException e) {
                Log.e(this.getClass().getCanonicalName(),
                        "MqttException Occured", e);
            }
        }

    }

    @Override
    public String getName() {
        return "RNMQTTClient";
    }

    @ReactMethod
    public void publish(String topic, String message, int qos, boolean retained){
        try {
            IMqttDeliveryToken deliveryToken = Connections.getInstance(getReactApplicationContext()).getConnection(clientHandle)
                    .getClient().publish(topic, message.getBytes(), qos, retained);
            //successCallback.invoke(deliveryToken.getMessageId());
            //completePendingSubscriptions();
        }
        catch (MqttSecurityException e) {
            Log.e(this.getClass().getCanonicalName(), "Failed to publish a message ", e);
            //errorCallback.invoke(e.getReasonCode(), e.getMessage());
        }
        catch (MqttException e) {
            Log.e(this.getClass().getCanonicalName(), "Failed to publish a message ", e);
            //errorCallback.invoke(e.getReasonCode(), e.getMessage());
        }
    }

    /**
     * Subscribe to a topic that the user has specified
     */
    @ReactMethod
    public void subscribeTo(String topicName, int qosLevel)
    {
        try {
            Connection conn = Connections.getInstance(getReactApplicationContext()).getConnection(clientHandle);
            MqttAndroidClient mqttAndroidClient = conn.getClient();
            mqttAndroidClient.subscribe(topicName, qosLevel);
        } catch (Exception e) {
            Log.e(this.getClass().getCanonicalName(), "Failed to subscribe to" + topicName, e);
        }
    }

    @ReactMethod
    public void unSubscribeTo(String topicName, int qosLevel)
    {
        try {
            Connection conn = Connections.getInstance(getReactApplicationContext()).getConnection(clientHandle);
            MqttAndroidClient mqttAndroidClient = conn.getClient();
            mqttAndroidClient.unsubscribe(topicName);
        } catch (MqttException e) {
            Log.e(this.getClass().getCanonicalName(), "Failed to unsubscribe to" + topicName, e);
        }
    }

}
