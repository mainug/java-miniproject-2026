package com.pknu26.usedtrade.service;

import com.pknu26.usedtrade.dto.PostDTO;
import com.pknu26.usedtrade.dto.PostImageDTO;
import com.pknu26.usedtrade.mapper.PostImageMapper;
import com.pknu26.usedtrade.mapper.PostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {

    private final PostMapper postMapper;
    private final PostImageMapper postImageMapper;

    public PostService(PostMapper postMapper, PostImageMapper postImageMapper) {
        this.postMapper = postMapper;
        this.postImageMapper = postImageMapper;
    }

    @Transactional
    public Long registerPost(PostDTO postDTO) {
        postMapper.insertPost(postDTO);
        return postDTO.getPostId();
    }

    public List<PostDTO> findAllPosts() {
        return postMapper.findAllPosts();
    }

    @Transactional
    public PostDTO findPostDetail(Long postId) {
        postMapper.increaseViewCount(postId);

        PostDTO post = postMapper.findPostById(postId);

        if (post == null) {
            return null;
        }

        List<PostImageDTO> images = postImageMapper.findImagesByPostId(postId);
        post.setImages(images);

        return post;
    }
}