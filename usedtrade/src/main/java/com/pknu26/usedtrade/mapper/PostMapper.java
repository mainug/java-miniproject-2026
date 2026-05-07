package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.PostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {

    int insertPost(PostDTO postDTO);

    List<PostDTO> findAllPosts();

    PostDTO findPostById(Long postId);

    int increaseViewCount(Long postId);

    int updatePost(PostDTO postDTO);

    int updatePostStatus(PostDTO postDTO);

    int deletePostImages(Long postId);

    int deletePost(Long postId);
    
}