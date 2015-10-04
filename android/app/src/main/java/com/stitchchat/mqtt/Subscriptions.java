package com.stitchchat.mqtt;

import java.util.Collection;
import java.util.HashMap;

public class Subscriptions {

    /** Singleton instance of <code>Subscriptions</code>**/
    private static Subscriptions instance = null;

    /** List of {@link Subscription} objects**/
    private HashMap<String, Subscription> subscriptions = null;

    public synchronized static Subscriptions getInstance()
    {
        if (instance == null) {
            instance = new Subscriptions();
        }

        return instance;
    }

    /**
     * Create a Subscriptions object
     */
    private Subscriptions()
    {
        subscriptions = new HashMap<String, Subscription>();

    }

    public void addSubscription(Subscription subscription)
    {
        subscriptions.put(subscription.getTopicName(), subscription);
    }

    public void removeSubscription(String topicName)
    {
        subscriptions.remove(topicName);
    }

    public Collection<Subscription> getSubscriptions() {
        return subscriptions.values();
    }
}
