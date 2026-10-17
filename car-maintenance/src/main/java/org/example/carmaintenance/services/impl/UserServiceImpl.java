package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.UserLoginRequest;
import org.example.carmaintenance.dtos.requests.UserSignUpRequest;
import org.example.carmaintenance.dtos.responses.UserLoginResponse;
import org.example.carmaintenance.dtos.responses.UserSignupResponse;
import org.example.carmaintenance.models.User;
import org.example.carmaintenance.repositories.UserRepository;
import org.example.carmaintenance.services.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserLoginResponse authenticate(UserLoginRequest userLoginRequest) {
         List<User> users = userRepository.findAll();

         for (User user: users) {
             if (isUserMatched(user, userLoginRequest)) {
                 return new UserLoginResponse(true, "login succeeded!");
             }
         }

        return new UserLoginResponse(false, "User " + userLoginRequest.username() + " not found");
    }

    private boolean isUserMatched(User user, UserLoginRequest userLoginRequest) {
        boolean isUsernameMatched = user.getUsername().equals(userLoginRequest.username());

        boolean isPasswordMatched = user.getPassword().equals(userLoginRequest.password());

        return isUsernameMatched && isPasswordMatched;
    }

    @Override
    public UserSignupResponse signUp(UserSignUpRequest userSignUpRequest) {
        return null;
    }
}
