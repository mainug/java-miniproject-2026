package com.pknu26.usedtrade.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.pknu26.usedtrade.dto.User;
import com.pknu26.usedtrade.service.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입 페이지
    @GetMapping("/join")
    public String joinForm() {
        return "/user/join";
    }

    // 회원가입 처리
    @PostMapping("/join")
    public String join(User user) {

        userService.join(user);

        return "redirect:/login";
    }
}