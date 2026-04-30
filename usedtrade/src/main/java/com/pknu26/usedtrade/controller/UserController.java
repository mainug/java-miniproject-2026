package com.pknu26.usedtrade.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.pknu26.usedtrade.dto.UserDTO;
import com.pknu26.usedtrade.service.UserService;
import com.pknu26.usedtrade.validation.UserLoginForm;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    // 회원가입 페이지
    @GetMapping("/join")
    public String joinForm() {
        return "/users/join";
    }

    // 회원가입 처리
    @PostMapping("/join")
    public String join(UserDTO user) {

        userService.join(user);

        // 회원가입 후 로그인 페이지로 이동 (redirect)
        return "redirect:/users/login";
    }

    // 로그인 화면
    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("userLoginForm", new UserLoginForm());
        return "/users/login";
    }

}