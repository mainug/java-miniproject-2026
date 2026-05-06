package com.pknu26.usedtrade.mapper;

import com.pknu26.usedtrade.dto.CommunityPostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommunityPostMapper {

    int insertCommunityPost(CommunityPostDTO communityPostDTO);

    List<CommunityPostDTO> findAllCommunityPosts();

    CommunityPostDTO findCommunityPostById(Long communityPostId);

    void incrementViewCount(Long communityPostId);

    void deleteCommunityPost(Long communityPostId);

    void updateCommunityPost(CommunityPostDTO communityPostDTO);
}
