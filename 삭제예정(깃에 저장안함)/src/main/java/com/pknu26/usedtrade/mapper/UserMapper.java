package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    // 아이디로 회원 정보 가져오기
    UserDto findByLoginId(@Param("loginId") String loginId);
}