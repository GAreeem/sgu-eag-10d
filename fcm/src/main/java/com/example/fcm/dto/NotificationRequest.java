package com.example.fcm.dto;

import lombok.Data;
import java.util.Map;

@Data
public class NotificationRequest {
    private String token;
    private String topic;
    private String title;
    private String body;
    private Map<String, String> data;
}
