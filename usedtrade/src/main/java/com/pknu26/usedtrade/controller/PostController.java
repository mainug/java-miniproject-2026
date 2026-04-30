package com.pknu26.usedtrade.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pknu26.usedtrade.dto.PostDTO;
import com.pknu26.usedtrade.service.PostService;

@Controller 
@RequestMapping("/products")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/add")
    public String createProduct(PostDTO postDTO) {
        
        // 임시 데이터 세팅
        postDTO.setUserId(1L);
        postDTO.setBoardId(1L);

        // DB 저장
        postService.registerPost(postDTO);

        // 등록 후 메인 페이지로 이동 (redirect)
        return "redirect:/"; 
    }
    
}
