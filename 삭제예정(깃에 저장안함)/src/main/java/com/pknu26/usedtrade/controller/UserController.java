package com.pknu26.usedtrade.controller;

import com.pknu26.usedtrade.dto.UserDto;
import com.pknu26.usedtrade.service.UserService;
import jakarta.servlet.http.HttpSession; // 세션 사용을 위해 필요
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    
     /**
     * 회원가입 데이터 처리 및 로그인 페이지로 리다이렉트
     */
    @PostMapping("/users/join")
    public String joinUser() {
        
        // 1. 나중에는 여기에 사용자가 입력한 아이디, 비밀번호 등을 받아서 
        // DB에 저장하는 Service 코드가 들어오게 됩니다. (현재는 빈칸)
        System.out.println("회원가입 요청이 성공적으로 들어왔습니다!");

        // 2. 작업이 끝난 후 로그인 페이지 주소로 강제 이동(Redirect)
        return "redirect:/login"; 
    }

    @PostMapping("/users/login")
    public String loginUser(
            @RequestParam String loginId, 
            @RequestParam String password,
            HttpSession session) { // 세션 객체 주입

        // 1. 매니저에게 로그인 확인 요청
        UserDto loginUser = userService.login(loginId, password);

        if (loginUser != null) {
            // 2. 로그인 성공 시: 세션에 유저 정보 저장
            // 이 "loginUser"라는 이름이 index.html의 th:if 조건과 연결됩니다!
            session.setAttribute("loginUser", loginUser);
            return "redirect:/"; // 성공하면 메인 페이지로 이동
        } else {
            // 3. 로그인 실패 시: 다시 로그인 페이지로 (에러 표시를 위해 파라미터 전달 가능)
            return "redirect:/login?error=true";
        }
    }
}