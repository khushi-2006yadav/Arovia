package com.arovia.arovia_backend.Controller;


import com.arovia.arovia_backend.Dto.OAuthDto;
import com.arovia.arovia_backend.Dto.SigninDto;
import com.arovia.arovia_backend.Dto.SignupDto;
import com.arovia.arovia_backend.Dto.UserResponseDto;
import com.arovia.arovia_backend.Entity.Patient;
import com.arovia.arovia_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public void userSignup(@RequestBody SignupDto signupDto)
    {
        userService.addUser(signupDto);
    }

    @PostMapping("/signin")
    public UserResponseDto userSignin(@RequestBody SigninDto signinDto)
    {
        return userService.loginUser(signinDto);
    }

    @PostMapping("/oauth-signin")
    public UserResponseDto oauthSignin(@RequestBody Map<String, String> request) {
        return userService.oauthLoginUser(request.get("token"));
    }

    @PostMapping("/oauth-signup")
    public UserResponseDto oauthSignup(@RequestBody OAuthDto oAuthDto)
    {
        return userService.oauthAddUser(oAuthDto);
    }

}
