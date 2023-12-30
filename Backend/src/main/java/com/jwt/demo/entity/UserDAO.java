package com.jwt.demo.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class UserDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static class UserRowMapper implements RowMapper<User> {
		@Override
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setUserId(rs.getString("user_id"));
			user.setName(rs.getString("name"));
			user.setEmail(rs.getString("email"));
			user.setPassword(rs.getString("password"));
			user.setRole(rs.getString("role"));

			return user;
		}
	}

	public boolean existsByEmail(String email) {
		try {
			String sql = "SELECT COUNT(*) FROM user_table WHERE email = ?";
			Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
			return count != null && count > 0;
		} catch (Exception e) {
			// Log or handle the exception appropriately
			e.printStackTrace();
			return false;
		}
	}

	public Optional<User> findByEmail(String email) {
		try {
			String sql = "SELECT * FROM user_table WHERE email = ?";
			@SuppressWarnings("deprecation")
			User user = jdbcTemplate.queryForObject(sql, new Object[] { email }, new UserRowMapper());
			return Optional.ofNullable(user);
		} catch (Exception e) {
			// Log or handle the exception appropriately
			e.printStackTrace();
			return Optional.empty();
		}
	}
}
