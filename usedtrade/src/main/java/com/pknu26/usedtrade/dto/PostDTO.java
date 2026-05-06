package com.pknu26.usedtrade.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDTO {

    private Long postId;
    private Long userId;
    private Long buyerId;
    private Long boardId;

    private String title;
    private String content;
    private Long price;
    private String category;
    private String location;
    private String status;

    private Long viewCount;
    private LocalDateTime createdAtPosts;
    private String mainImageUrl;
}