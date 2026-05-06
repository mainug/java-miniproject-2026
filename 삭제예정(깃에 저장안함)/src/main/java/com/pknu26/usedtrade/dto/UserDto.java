package com.pknu26.usedtrade.dto;

import java.sql.Timestamp;

public class UserDto {
    private Long userId;
    private String loginId;
    private String password;
    private String userName;
    private String nickname;
    private String role;
    private Timestamp createdAtUser;

    // 기본 생성자, Getter, Setter 직접 작성 (Lombok 미사용 시)
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getLoginId() { return loginId; }
    public void setLoginId(String loginId) { this.loginId = loginId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    // ... 나머지 일단 생략
}