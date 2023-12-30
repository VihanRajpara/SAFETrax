package com.jwt.demo.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class SendingEmail {
	String otp="myotp";
    @Autowired
    private JavaMailSender javaMailSender;

    private String generateOTP() {
        // Generate a random 6-digit OTP
        Random random = new Random();
        int otp = 100000 + random.nextInt(999999);
        return String.valueOf(otp);
    }

    public String sendSetPasswordEmail(String email) {
    	 
        try {
            otp = generateOTP(); // Generate a 6-digit OTP
            javaMailSender.send(prepareSetPasswordEmail(email, otp));
        } catch (MailException e) {
            
            e.printStackTrace();
        }
        return otp;
    }

    private MimeMessagePreparator prepareSetPasswordEmail(String email, String otp) {
        return mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String content = "<div>" +
                    "<p>Your OTP for setting a password is:</p>" +
                    "<p style=\"font-size: 18px; font-weight: bold;\">%s</p>" +
                    "</div>";

            content = String.format(content, otp);

            mimeMessage.setContent(content, "text/html");
            helper.setTo(email);
            helper.setSubject("(no-reply)Set Password - OTP");
        };
    }
}
