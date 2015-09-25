package com.stitchchat.mqtt;

/**
 * Created by ramsundar on 9/24/15.
 */
public class Subscription {

    private String topicName;

    private int qosLevel;

    public Subscription(String topicName, int qosLevel){
        this.topicName = topicName;
        this.qosLevel  = qosLevel;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Subscription that = (Subscription) o;

        return topicName.equals(that.topicName);

    }

    @Override
    public int hashCode() {
        return topicName.hashCode();
    }
}
