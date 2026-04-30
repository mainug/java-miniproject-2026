package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.pknu26.usedtrade.dto.User;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findByLoginId(String loginId); // 중복 체크용
}