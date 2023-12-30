package com.jwt.demo.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



@Entity
@Table(name = "user_table"  ,uniqueConstraints = @UniqueConstraint(columnNames = "email"))

public class User implements UserDetails {

	@Id
	private String userId;

	@NotBlank(message = "Name cannot be blank")
	private String name;

	@NotBlank(message = "Email cannot be blank")
	@Email(message = "Invalid email format")
	private String email;

	@NotBlank(message = "Password cannot be blank")
	@Size(min = 4, message = "Password must be at least 4 characters")
	private String password;
  
  

	// Inside the User class
	private String role;

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public User() {

	}

	public User(String userId, String name, String email, String password) {
		super();
		this.userId = userId;
		this.name = name;
		this.email = email;
		this.password = password;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", name=" + name + ", email=" + email + ", password=" + password + "]";
	}
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    Set<GrantedAuthority> authorities = new HashSet<>();
	    String[] roleArray = role.split(",");
	    for (String role : roleArray) {
	        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.trim()));
	    }
	    return authorities;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

}
