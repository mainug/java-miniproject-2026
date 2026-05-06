package com.pknu26.usedtrade.service;

import com.pknu26.usedtrade.dto.UserDto;
import com.pknu26.usedtrade.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 로그인 검증 로직
     * @return 로그인 성공 시 UserDto, 실패 시 null
     */
    public UserDto login(String loginId, String password) {
        // 1. 아이디로 회원 정보 조회
        UserDto user = userMapper.findByLoginId(loginId);

        // 2. 회원이 존재하고 비밀번호가 일치하는지 확인
        if (user != null && user.getPassword().equals(password)) {
            return user; // 로그인 성공
        }
        return null; // 로그인 실패
    }
}