package com.example.fcm.service;

import com.example.fcm.dto.NotificationRequest;
import com.example.fcm.model.FcmToken;
import com.example.fcm.model.FcmTokenRepository;
import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class FirebaseMessagingService {

    private final FcmTokenRepository tokenRepository;

    public FirebaseMessagingService(FcmTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String sendNotification(NotificationRequest request) throws FirebaseMessagingException {

        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();

        Message.Builder builder = Message.builder().setNotification(notification);

        if (request.getData() != null) {
            builder.putAllData(request.getData());
        }

        if (request.getToken() != null && !request.getToken().isBlank()) {
            builder.setToken(request.getToken());

            tokenRepository.findByToken(request.getToken())
                    .orElseGet(() -> tokenRepository.save(new FcmToken(request.getToken())));

        } else if (request.getTopic() != null && !request.getTopic().isBlank()) {
            builder.setTopic(request.getTopic());
        } else {
            throw new IllegalArgumentException("Debes enviar 'token' o 'topic'");
        }

        return FirebaseMessaging.getInstance().send(builder.build());
    }

    public List<String> broadcast(NotificationRequest request) throws FirebaseMessagingException {
        var tokens = tokenRepository.findAll();

        if (tokens.isEmpty()) {
            return Collections.emptyList();
        }

        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();

        List<Message> messages = new ArrayList<>();

        for (FcmToken t : tokens) {
            Message.Builder builder = Message.builder()
                    .setNotification(notification)
                    .setToken(t.getToken());

            if (request.getData() != null && !request.getData().isEmpty()) {
                builder.putAllData(request.getData());
            }

            messages.add(builder.build());
        }

        List<String> messageIds = new ArrayList<>();
        for (Message m : messages) {
            messageIds.add(FirebaseMessaging.getInstance().send(m));
        }

        return messageIds;
    }
}
