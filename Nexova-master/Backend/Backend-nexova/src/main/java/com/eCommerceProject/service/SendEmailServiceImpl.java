package com.eCommerceProject.service;

import com.eCommerceProject.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendEmailServiceImpl implements SendEmailService {

    private static final Logger log = LoggerFactory.getLogger(SendEmailServiceImpl.class);

    private final JavaMailSender javaMailSender;
    private final UserService userService;

    @Override
    public void sendEmails(String to, String body, String topic) {
        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom("tiklakapinda");
            simpleMailMessage.setTo(to);
            simpleMailMessage.setSubject(topic);
            simpleMailMessage.setText(body);
            javaMailSender.send(simpleMailMessage);
        } catch (Exception e) {
            log.warn("[Nexova] Email could not be sent to {}: {}", to, e.getMessage());
            // silently skip — email is non-critical
        }
    }

    @Override
    public void sendEmailAllUser(String body, String topic) {
        userService.getAll().forEach(user -> {
            if (user.isNotificationPermission()) {
                try {
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setTo(user.getEMail());
                    simpleMailMessage.setSubject(topic);
                    simpleMailMessage.setText(body);
                    javaMailSender.send(simpleMailMessage);
                } catch (Exception e) {
                    log.warn("[Nexova] Email could not be sent to {}: {}", user.getEMail(), e.getMessage());
                }
            }
        });
    }
}
