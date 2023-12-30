package com.jwt.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JwtDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(JwtDemoApplication.class, args);
		String str = "\u001B[32mYour app is Started.........\u001B[0m";
		System.out.println(str);
		
	}

}
