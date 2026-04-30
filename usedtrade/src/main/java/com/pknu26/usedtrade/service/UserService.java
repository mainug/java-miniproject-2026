package com.pknu26.usedtrade.service;

import org.springframework.stereotype.Service;

import com.pknu26.usedtrade.dto.UserDTO;
import com.pknu26.usedtrade.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public void join(UserDTO user) {

        // 아이디 중복 체크
        UserDTO exist = this.userMapper.findByLoginId(user.getLoginId());
        if (exist != null) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 기본값 설정
        user.setRole("USER");

        userMapper.insertUser(user);
    }


}