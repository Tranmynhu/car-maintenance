package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.UserLoginRequest;
import org.example.carmaintenance.dtos.requests.UserSignUpRequest;
import org.example.carmaintenance.dtos.responses.UserLoginResponse;
import org.example.carmaintenance.dtos.responses.UserSignupResponse;
import org.example.carmaintenance.models.User;
import org.example.carmaintenance.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User buildUser(long id, String username, String password) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }

    @Test
    void authenticate_succeedsWithMatchingCredentials() {
        when(userRepository.findAll()).thenReturn(List.of(
                buildUser(1L, "alice", "pw1"),
                buildUser(2L, "bob", "pw2")));

        UserLoginResponse response = userService.authenticate(new UserLoginRequest("bob", "pw2"));

        assertTrue(response.isLoginSuccess());
        assertEquals(2L, response.userId());
    }

    @Test
    void authenticate_failsWithWrongPassword() {
        when(userRepository.findAll()).thenReturn(List.of(buildUser(1L, "alice", "pw1")));

        UserLoginResponse response = userService.authenticate(new UserLoginRequest("alice", "wrong"));

        assertFalse(response.isLoginSuccess());
        assertEquals(-1L, response.userId());
    }

    @Test
    void authenticate_failsWhenUserNotFound() {
        when(userRepository.findAll()).thenReturn(List.of());

        UserLoginResponse response = userService.authenticate(new UserLoginRequest("ghost", "pw"));

        assertFalse(response.isLoginSuccess());
        assertEquals("User ghost not found", response.message());
    }

    @Test
    void signUp_savesUserAndReturnsSuccess() {
        UserSignupResponse response = userService.signUp(new UserSignUpRequest("alice", "pw1"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("alice", captor.getValue().getUsername());
        assertEquals("pw1", captor.getValue().getPassword());
        assertTrue(response.isSignUpSuccess());
    }

    @Test
    void signUp_throwsWhenUsernameBlank() {
        assertThrows(RuntimeException.class,
                () -> userService.signUp(new UserSignUpRequest(" ", "pw1")));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signUp_throwsWhenPasswordNull() {
        assertThrows(RuntimeException.class,
                () -> userService.signUp(new UserSignUpRequest("alice", null)));
        verify(userRepository, never()).save(any(User.class));
    }
}
