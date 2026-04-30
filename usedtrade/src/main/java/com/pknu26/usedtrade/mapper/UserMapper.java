package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.pknu26.usedtrade.dto.User;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findByLoginId(@Param("loginId") String loginId);
}