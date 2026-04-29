package com.pknu26.usedtrade.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.pknu26.usedtrade.dto.PostDTO;

@Mapper
public interface PostMapper {

    /**
     * 게시글 정보 저장
     * @param postDTO 게시글 데이터 (성공 시 postDTO 객체의 postId에 값이 채워짐)
     * @return 영향받은 행의 수 (보통 1)
     */
    int insertPost(PostDTO postDTO);

}
