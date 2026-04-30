package com.pknu26.usedtrade.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pknu26.usedtrade.dto.UserDTO;
import com.pknu26.usedtrade.mapper.UserMapper;
import com.pknu26.usedtrade.validation.UserJoinForm;
import com.pknu26.usedtrade.validation.UserLoginForm;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void join(UserJoinForm form) {

        // 비밀번호 확인
        if (!form.getPassword().equals(form.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 아이디 중복 체크
        UserDTO exist = this.userMapper.findByLoginId(form.getLoginId());
        if (exist != null) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        // UserJoinForm -> UserDTO 변환
        UserDTO user = new UserDTO();
        user.setLoginId(form.getLoginId());
        user.setUserName(form.getUserName());
        user.setPassword(form.getPassword());
        user.setNickname(form.getNickname());
        user.setPhone(form.getPhone());

        // 기본 권한 설정
        user.setRole("USER");

        user.setPassword(passwordEncoder.encode(form.getPassword()));

        userMapper.insertUser(user);
    }

    public UserDTO login(UserLoginForm form) {

    // 사용자가 입력한 아이디(loginId)로 DB에서 회원 정보를 조회
    UserDTO user = userMapper.findByLoginId(form.getLoginId());

    // 해당 아이디를 가진 회원이 없으면 로그인 실패
    if (user == null) {
        return null;
    }

    // DB에 저장된 비밀번호와 사용자가 입력한 비밀번호를 비교해서 일치하지 않으면 로그인 실패
    if (!user.getPassword().equals(form.getPassword())) {
        return null;
    }

    // 아이디와 비밀번호가 모두 일치하면 조회된 회원 정보를 반환
    return user;
}

    


}