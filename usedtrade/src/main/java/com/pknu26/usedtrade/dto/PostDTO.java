package com.pknu26.usedtrade.dto;

import lombok.Data;

@Data
public class PostDTO {

    private Long postId;       // DB의 post_id (PK)
    private Long userId;       // 작성자 ID (FK)
    private Long boardId;     // 카테고리/게시판 ID (FK)
    private String title;      // 제목
    private String content;    // 내용
    private Long price;        // 가격
    private String category;   // 카테고리명 (DIGITAL, FURNITURE 등)
    private String location;   // 거래 지역
    private String status;     // 상태 (기본값 'SELLING')
    
}
