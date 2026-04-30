package com.pknu26.usedtrade.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {

    private Long userId;

    private String loginId;
    private String userName;
    private String password;
    private String nickname;
    private String role;
    private String phone;

    private LocalDateTime createdAtUser;
}