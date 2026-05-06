package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.PostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {

    int insertPost(PostDTO postDTO);

    List<PostDTO> findAllPosts();
}