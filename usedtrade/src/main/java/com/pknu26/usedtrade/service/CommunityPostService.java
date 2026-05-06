package com.pknu26.usedtrade.service;

import com.pknu26.usedtrade.dto.CommunityPostDTO;
import com.pknu26.usedtrade.dto.PostImageDTO;
import com.pknu26.usedtrade.mapper.CommunityPostMapper;
import com.pknu26.usedtrade.mapper.PostImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityPostService {

    private final CommunityPostMapper communityPostMapper;
    private final PostImageMapper postImageMapper;

    @Transactional
    public Long registerCommunityPost(CommunityPostDTO communityPostDTO) {
        communityPostMapper.insertCommunityPost(communityPostDTO);
        return communityPostDTO.getCommunityPostId();
    }

    public List<CommunityPostDTO> findAllCommunityPosts() {
        return communityPostMapper.findAllCommunityPosts();
    }

    @Transactional
    public CommunityPostDTO findCommunityPostById(Long communityPostId) {
        communityPostMapper.incrementViewCount(communityPostId);
        return communityPostMapper.findCommunityPostById(communityPostId);
    }

    public List<PostImageDTO> findImagesByCommunityPostId(Long communityPostId) {
        return postImageMapper.findImagesByCommunityPostId(communityPostId);
    }

    @Transactional
    public void deleteCommunityPost(Long communityPostId, Long userId) {
        CommunityPostDTO post = communityPostMapper.findCommunityPostById(communityPostId);
        if (post == null || !post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        postImageMapper.deleteImagesByCommunityPostId(communityPostId);
        communityPostMapper.deleteCommunityPost(communityPostId);
    }

    @Transactional
    public void updateCommunityPost(CommunityPostDTO communityPostDTO, Long userId) {
        CommunityPostDTO post = communityPostMapper.findCommunityPostById(communityPostDTO.getCommunityPostId());
        if (post == null || !post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }
        communityPostMapper.updateCommunityPost(communityPostDTO);
    }
}
