package com.example.fcm.controller;

import com.example.fcm.dto.NotificationRequest;
import com.example.fcm.service.FirebaseMessagingService;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final FirebaseMessagingService firebaseService;

    public NotificationController(FirebaseMessagingService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @PostMapping("/send")
    public String send(@RequestBody NotificationRequest request)
            throws FirebaseMessagingException {
        return firebaseService.sendNotification(request);
    }
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcast(@RequestBody NotificationRequest request)
            throws FirebaseMessagingException {

        List<String> ids = firebaseService.broadcast(request);

        if (ids.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("No hay tokens registrados en la base de datos");
        }
        return ResponseEntity.ok(ids);
    }
}
