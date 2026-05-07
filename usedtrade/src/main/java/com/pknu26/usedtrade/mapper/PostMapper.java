package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.PostDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param; // 추가

import java.util.List;

@Mapper
public interface PostMapper {

    int insertPost(PostDTO postDTO);

    List<PostDTO> findAllPosts(@Param("loginUserId") Long loginUserId);

    PostDTO findPostById(@Param("postId") Long postId, 
                         @Param("loginUserId") Long loginUserId);

    int increaseViewCount(@Param("postId") Long postId);

    int updatePost(PostDTO postDTO);

    int updatePostStatus(PostDTO postDTO);

    int deletePostImages(@Param("postId") Long postId);

    int deletePost(@Param("postId") Long postId);
    
}