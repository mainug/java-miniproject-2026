package com.pknu26.usedtrade.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pknu26.usedtrade.dto.PostDTO;
import com.pknu26.usedtrade.mapper.PostMapper;

@Service
public class PostService {
    
    @Autowired
    private PostMapper postMapper;

    public void registerPost(PostDTO postDTO) {
        // DB에 저장
        postMapper.insertPost(postDTO);
        
        // 확인용: 저장된 직후의 postId 출력
        System.out.println("생성된 게시글 번호: " + postDTO.getPostId());
    }
}
