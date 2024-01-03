package com.jwt.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwt.demo.entity.Employee;
import com.jwt.demo.entity.Insurances;
import com.jwt.demo.entity.Menu;
import com.jwt.demo.entity.User;
import com.jwt.demo.entity.UserDAO;
import com.jwt.demo.entity.User_SafeTrax;
import com.jwt.demo.jwt.JwtHelper;
import com.jwt.demo.jwt.JwtRequest;
import com.jwt.demo.jwt.JwtResponse;
import com.jwt.demo.jwt.MessageResponse;
import com.jwt.demo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:3000")

public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    UserDAO userDAO;
    
    public record forgotbody (String email, String password) {}

    // private Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {

        this.doAuthenticate(request.getEmail(), request.getPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = this.helper.generateToken(userDetails);

        JwtResponse response = JwtResponse.builder()
                .jwttoken(token)
                .username(userDetails.getUsername()).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            manager.authenticate(authentication);

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password  !!");
        }

    }

    // @ExceptionHandler(BadCredentialsException.class)
    // public String exceptionHandler() {
    // return "Credentials Invalid !!";
    // }

    @PostMapping("/adduser")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Handle validation errors
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.badRequest().body(new MessageResponse("Validation error: " + errors));
        }

        // Check if email is already in use
        if (userDAO.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create the user
        @SuppressWarnings("unused") // used to suppress warning
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(new MessageResponse("User created successfully"));
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return new ResponseEntity<>(userService.forgetPassword(email), HttpStatus.OK);
    }

    @PutMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestParam String email, @RequestHeader String newPassword) {
        return new ResponseEntity<>(userService.setPassword(email, newPassword), HttpStatus.OK);
    }

    

}
