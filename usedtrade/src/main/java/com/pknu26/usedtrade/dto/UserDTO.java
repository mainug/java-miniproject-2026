package com.pknu26.usedtrade.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {

<<<<<<< HEAD
    private Long userId;    // DB의 userId(PK)
    private String loginId; // 로그인 아이디
    private String userName;    // 사용자 이름
    private String password;    // 로그인 비밀번호
    private String nickname;    // 사용자 닉네임
    private String role;    // 역할
    private String phone;   // 전화번호

    private LocalDateTime createdAtUser;    // 생성 날짜
=======
    private Long userId;

    private String loginId;
    private String userName;
    private String password;
    private String nickname;
    private String role;
    private String phone;

    private LocalDateTime createdAtUser;
>>>>>>> 7379014e57389f8606c1cf4368c9fb73d3787796
}