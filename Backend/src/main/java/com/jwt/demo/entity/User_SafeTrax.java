package com.jwt.demo.entity;

import org.springframework.jdbc.core.RowMapper;

public class User_SafeTrax {
	
	private String user_id;

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	 public static RowMapper<User_SafeTrax> rowMapper = (rs, rowNum) -> {

		    User_SafeTrax user = new User_SafeTrax();
	        user.setUser_id(rs.getString("user_id"));

	        return user;
	    };
}
