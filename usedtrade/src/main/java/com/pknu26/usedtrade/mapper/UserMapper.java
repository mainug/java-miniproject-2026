package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.pknu26.usedtrade.dto.UserDTO;

@Mapper
public interface UserMapper {

    void insertUser(UserDTO user);

    UserDTO findByLoginId(String loginId); // 중복 체크용
}