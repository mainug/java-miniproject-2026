package com.pknu26.usedtrade.service;

import org.springframework.stereotype.Service;

import com.pknu26.usedtrade.dto.UserDTO;
import com.pknu26.usedtrade.dto.UserForm;
import com.pknu26.usedtrade.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public void join(UserForm form) {

        // 중복 체크
        UserDTO exist = userMapper.findByLoginId(form.getLoginId());
        if (exist != null) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // DTO → Entity 변환
        UserDTO user = new UserDTO();
        user.setLoginId(form.getLoginId());
        user.setUserName(form.getUserName());
        user.setPassword(form.getPassword());
        user.setNickname(form.getNickname());
        user.setPhone(form.getPhone());

        user.setRole("USER");

        userMapper.insertUser(user);
    }

}