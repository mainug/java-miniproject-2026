package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.PostImageDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostImageMapper {

    int insertPostImage(PostImageDTO postImageDTO);

    List<PostImageDTO> findImagesByPostId(Long postId);
}