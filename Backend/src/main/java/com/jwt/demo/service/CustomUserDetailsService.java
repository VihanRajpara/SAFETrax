package com.jwt.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jwt.demo.entity.User;
import com.jwt.demo.entity.UserDAO;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserDAO userDAO;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		User user = userDAO.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found with given username "+ username));
		return (UserDetails) user;
	}

}
