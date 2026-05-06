package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;
<<<<<<< HEAD
import org.apache.ibatis.annotations.Param;
=======
>>>>>>> 7379014e57389f8606c1cf4368c9fb73d3787796

import com.pknu26.usedtrade.dto.UserDTO;

@Mapper
public interface UserMapper {

    void insertUser(UserDTO user);

<<<<<<< HEAD
    UserDTO findByLoginId(@Param("loginId") String loginId);
=======
    UserDTO findByLoginId(String loginId); // 중복 체크용
>>>>>>> 7379014e57389f8606c1cf4368c9fb73d3787796
}