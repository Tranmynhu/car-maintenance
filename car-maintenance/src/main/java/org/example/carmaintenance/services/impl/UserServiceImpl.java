package org.example.carmaintenance.services.impl;

import org.apache.commons.lang3.StringUtils;
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
        String username = userSignUpRequest.username();
        String password = userSignUpRequest.password();

        // validation
        if (StringUtils.isAnyBlank(username, password)) {
            throw new RuntimeException("Username and password cannot be blank");
        }

        // save to database
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        userRepository.save(user);

        return new UserSignupResponse(true, "SignUp Succeeded");
    }
}
