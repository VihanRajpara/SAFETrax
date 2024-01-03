package com.jwt.demo.service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.jwt.demo.email.SendingEmail;
import com.jwt.demo.entity.User;
import com.jwt.demo.entity.UserDAO;
import com.jwt.demo.jwt.MessageResponse;

import jakarta.validation.Valid;

@Service
@Validated
public class UserService {

	@Autowired
	UserDAO userDAO;

	@Autowired
	SendingEmail forgetPassword;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<User> getUsers() {
		String sql = "SELECT * FROM user_table";
		return jdbcTemplate.query(sql, new UserRowMapper());
	}

	public ResponseEntity<?> getOneUser(String email) {
		// Get the email from the currently authenticated user's context
		String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("Current Authorized user " + authenticatedUserEmail);

		// Check if the requested email matches the authenticated user's email
		if (!authenticatedUserEmail.equals(email)) {
			String errorMessage = "Access denied: You do not have permission to access this resource.";
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse(errorMessage));
		}
		String sql = "SELECT * FROM demo_db.user_table WHERE email = ?";
		try {
			User user = jdbcTemplate.queryForObject(sql, new Object[] { email }, new UserRowMapper());
			// If user is found, return it with a 200 OK status
			return ResponseEntity.ok(user);
		} catch (EmptyResultDataAccessException e) {
			// Handle the case where no user is found for the given email
			// Return a 404 Not Found status
			return ResponseEntity.notFound().build();
		}
	}

	public User createUser(@Valid User user) {
		user.setUserId(UUID.randomUUID().toString());
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		String sql = "INSERT INTO user_table (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
		jdbcTemplate.update(sql, user.getUserId(), user.getName(), user.getEmail(), user.getPassword(), user.getRole());

		return user;
	}

	private static class UserRowMapper implements RowMapper<User> {
		@Override
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setUserId(rs.getString("user_id"));
			user.setName(rs.getString("name"));
			user.setEmail(rs.getString("email"));
			user.setPassword(rs.getString("password"));
			// Inside the UserRowMapper
			user.setRole(rs.getString("role"));

			return user;
		}
	}

	public ResponseEntity<String> forgetPassword(String email) {
		try {
			User user = userDAO.findByEmail(email)
					.orElseThrow(() -> new RuntimeException("User not found with email" + email));
			String otp = forgetPassword.sendSetPasswordEmail(email);
			return ResponseEntity.ok("Please check your email for the OTP: " + otp);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error sending email. Please check your email and try again later. " + email);
		}
	}

	public ResponseEntity<String> setPassword(String email, String newPassword) {
		System.out.print(email);
		try {
			User user = userDAO.findByEmail(email)
					.orElseThrow(() -> new RuntimeException("User not found with email " + email));

			String encodedPassword = passwordEncoder.encode(newPassword);

			String updateSql = "UPDATE user_table SET password = ? WHERE email = ?";
			jdbcTemplate.update(updateSql, encodedPassword, email);

			return ResponseEntity.ok("Your new password has been updated.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
		}
	}

}
