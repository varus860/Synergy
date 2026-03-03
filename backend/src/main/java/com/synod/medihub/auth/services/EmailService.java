package com.synod.medihub.auth.services;

import com.synod.medihub.auth.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Value("${app.debug:false}")
    private boolean debug;

    public void sendMail(User user){
        String subject = "Verify your email";
        String senderName = "Synergy";
        String mailContent = "Hello " + user.getUsername() + ",\n";
        mailContent += "Your verification code is: " + user.getVerificationCode() + "\n";
        mailContent += "Please enter this code to verify your email.";
        mailContent +="\n";
        mailContent+= senderName;

        try{
            SimpleMailMessage mailMessage
                    = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(user.getEmail());
            mailMessage.setText(mailContent);
            mailMessage.setSubject(subject);
            javaMailSender.send(mailMessage);
            log.info("Email sent successfully to {}", user.getEmail());
        }
        catch (Exception e){
            if (debug) {
                log.warn("Debug mode active: Email failed to send. Verification code for {} is: {}", user.getEmail(), user.getVerificationCode());
                log.error("Error details: {}", e.getMessage());
            } else {
                log.error("Error while sending mail to {}: {}", user.getEmail(), e.getMessage());
                throw new RuntimeException("Error while Sending Mail: " + e.getMessage(), e);
            }
        }
    }
}
