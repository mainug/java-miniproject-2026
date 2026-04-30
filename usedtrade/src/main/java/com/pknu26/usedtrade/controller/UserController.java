package com.pknu26.usedtrade.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.pknu26.usedtrade.dto.UserDTO;
import com.pknu26.usedtrade.dto.UserForm;
import com.pknu26.usedtrade.service.UserService;
import com.pknu26.usedtrade.validation.UserJoinForm;
import com.pknu26.usedtrade.validation.UserLoginForm;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/join")
    public String joinForm(Model model) {
        model.addAttribute("userJoinForm", new UserJoinForm());
        return "/users/join";
    }

    @PostMapping("/join")
    public String join(@Valid @ModelAttribute("userJoinForm") UserJoinForm form,
                        BindingResult bindingResult) {

        // 입력 검증 실패 시 회원가입 페이지로 다시 이동
        if (bindingResult.hasErrors()) {
            return "/users/join";
        }

        try {
            userService.join(form);
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage() != null
                    ? e.getMessage()
                    : "회원가입 처리 중 오류가 발생했습니다.";
            bindingResult.reject("error", null, errorMessage);
            return "/users/join";  // 에러메시지가 html에 출력
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

    // 로그인 처리
    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("userLoginForm") UserLoginForm form,
                        BindingResult bindingResult,
                        HttpSession session) {

        // 입력 검증 실패 시 로그인 화면으로 돌아감
        if (bindingResult.hasErrors()) {
            return "/users/login";
        }

        UserDTO user = this.userService.login(form);

        if (user == null) {
            bindingResult.reject(
                    "error",
                    null,
                    "아이디 또는 패스워드가 올바르지 않습니다."
            );
            return "/users/login";
        }

        // 세션에 로그인 사용자 정보 저장
        session.setAttribute("loginUser", user);

        return "redirect:/";
    }

    // 로그아웃
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

}