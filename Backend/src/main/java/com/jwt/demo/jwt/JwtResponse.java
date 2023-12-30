package com.jwt.demo.jwt;

import org.springframework.stereotype.Component;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Data
@Component
public class JwtResponse {
	private String jwttoken;
	private String username;

	public JwtResponse() {
	
	}

	public JwtResponse(String jwttoken, String username) {
		super();
		this.jwttoken = jwttoken;
		this.username = username;
	}

	public String getJwttoken() {
		return jwttoken;
	}

	public void setJwttoken(String jwttoken) {
		this.jwttoken = jwttoken;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public static Builder builder() {
		return new Builder();
	}

	public String toString() {
		return "JwtResponse [jwttoken=" + jwttoken + ", username=" + username + "]";
	}

	public static class Builder {
		private String jwttoken;
		private String username;

		public Builder jwttoken(String jwttoken) {
			this.jwttoken = jwttoken;
			return this;
		}

		public Builder username(String username) {
			this.username = username;
			return this;
		}

		public JwtResponse build() {
			return new JwtResponse(jwttoken, username);
		}
	}

}
