package com.pknu26.usedtrade.service;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.pknu26.usedtrade.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

import com.pknu26.usedtrade.dto.UserDTO;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String loginId)
            throws UsernameNotFoundException {

        UserDTO user = userMapper.findByLoginId(loginId);

        if (user == null) {
            throw new UsernameNotFoundException("사용자 없음");
        }

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getLoginId())
                .password(user.getPassword()) // DB에 저장된 암호화 비밀번호
                .roles(user.getRole())        // "USER"
                .build();
    }
}