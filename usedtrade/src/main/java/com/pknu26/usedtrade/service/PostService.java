package com.pknu26.usedtrade.service;

import com.pknu26.usedtrade.dto.PostDTO;
import com.pknu26.usedtrade.mapper.PostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {

    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    @Transactional
    public Long registerPost(PostDTO postDTO) {
        postMapper.insertPost(postDTO);
        return postDTO.getPostId();
    }

    public List<PostDTO> findAllPosts() {
        return postMapper.findAllPosts();
    }
}