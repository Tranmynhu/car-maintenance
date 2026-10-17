package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.requests.UserLoginRequest;
import org.example.carmaintenance.dtos.requests.UserSignUpRequest;
import org.example.carmaintenance.dtos.responses.UserLoginResponse;
import org.example.carmaintenance.dtos.responses.UserSignupResponse;
import org.example.carmaintenance.services.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public UserLoginResponse login(@RequestBody UserLoginRequest userLoginRequest) {
        return userService.authenticate(userLoginRequest);
    }

    @PostMapping("/signUp")
    public UserSignupResponse signUp(@RequestBody UserSignUpRequest userSignUpRequest) {
        return userService.signUp(userSignUpRequest);
    }
}
