package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.pknu26.usedtrade.dto.UserDTO;

@Mapper
public interface UserMapper {

    void insertUser(UserDTO user);

    User findByLoginId(@Param("loginId") String loginId);
}