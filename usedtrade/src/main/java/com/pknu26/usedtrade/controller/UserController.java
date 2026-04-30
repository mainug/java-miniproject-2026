package com.pknu26.usedtrade.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.pknu26.usedtrade.dto.UserForm;
import com.pknu26.usedtrade.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/join")
    public String joinForm(Model model) {
        model.addAttribute("userForm", new UserForm());
        return "/user/join";
    }

    @PostMapping("/join")
    public String join(
            @Valid UserForm userForm,
            BindingResult bindingResult
    ) {

        // 1. Validation 실패 시
        if (bindingResult.hasErrors()) {
            return "/user/join";
        }

        try {
            userService.join(userForm);
        } catch (RuntimeException e) {
            bindingResult.reject("joinFail", e.getMessage());
            return "/user/join";
        }

        return "redirect:/login";
    }
}