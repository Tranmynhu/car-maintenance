package org.example.carmaintenance.services;

import org.example.carmaintenance.dtos.requests.UserLoginRequest;
import org.example.carmaintenance.dtos.requests.UserSignUpRequest;
import org.example.carmaintenance.dtos.responses.UserLoginResponse;
import org.example.carmaintenance.dtos.responses.UserSignupResponse;

public interface UserService {
    UserLoginResponse authenticate(UserLoginRequest userLoginRequest);

    UserSignupResponse signUp(UserSignUpRequest userSignUpRequest);
}
