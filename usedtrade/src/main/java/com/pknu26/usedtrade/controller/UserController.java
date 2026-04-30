package com.pknu26.usedtrade.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.pknu26.usedtrade.dto.UserForm;
import com.pknu26.usedtrade.service.UserService;
import com.pknu26.usedtrade.validation.UserLoginForm;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/join")
    public String joinForm(Model model) {
        model.addAttribute("userForm", new UserForm());
        return "/users/join";
    }

    @PostMapping("/join")
    public String join(
            @Valid UserForm userForm,
            BindingResult bindingResult
    ) {

        // 1. Validation 실패 시
        if (bindingResult.hasErrors()) {
            return "/users/join";
        }

        try {
            userService.join(userForm);
        } catch (RuntimeException e) {
            bindingResult.reject("joinFail", e.getMessage());
            return "/users/join";
        }

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