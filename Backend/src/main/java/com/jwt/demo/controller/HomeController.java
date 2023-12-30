package com.jwt.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwt.demo.entity.Employee;
import com.jwt.demo.entity.Menu;
import com.jwt.demo.entity.User;
import com.jwt.demo.entity.User_SafeTrax;
import com.jwt.demo.jwt.MessageResponse;
import com.jwt.demo.service.UserService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
public class HomeController {

  // Logger logger = (Logger) LoggerFactory.getLogger(HomeController.class);

  @Autowired

  private UserService userService;


  @RequestMapping("/test")
  public String test() {
    // this.logger.warn("This is working message");
    return "Testing message";

  }

  @GetMapping("/admin/users")
  public List<User> getUSers() {
    return this.userService.getUsers();
  }

  @GetMapping("/{email}")
  public ResponseEntity<?> getUser(@PathVariable String email) {
    System.out.println("email ---- " + email);
    return this.userService.getOneUser(email);
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<?> adminAccess() {
    return ResponseEntity.ok(new MessageResponse("ADMIN CONTENT"));
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> userAccess() {
    return ResponseEntity.ok(new MessageResponse("USER CONTENT"));
  }

}