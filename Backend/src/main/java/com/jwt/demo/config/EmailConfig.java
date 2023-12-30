//package com.jwt.demo.config;
//
//import java.util.Properties;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.JavaMailSenderImpl;
//
//@Configuration
//public class EmailConfig {
//
//    @Bean
//    public JavaMailSender javaMailSender() {
//        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//        mailSender.setHost("smtp.gmail.com");
//        mailSender.setPort(587); // Use your mail server port
//        mailSender.setUsername("senderfromern@gmail.com");
//        mailSender.setPassword("vgghkoksogbhhtve");
//
//        // Additional mail properties
//        Properties props = mailSender.getJavaMailProperties();
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.starttls.enable", "true");
//        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
//
//
//        return mailSender;
//    }
//}
