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

    public List<PostDTO> findPostsWithPaging(String searchKeyword, String category, String sortCondition, int offset, int pageSize) {
        return postMapper.findPostsWithPaging(searchKeyword, category, sortCondition, offset, pageSize);
    }

    @Transactional
    public PostDTO findPostDetail(Long postId, Long loginUserId) {
        postMapper.increaseViewCount(postId);

        PostDTO post = postMapper.findPostById(postId);

        if (post == null) {
            return null;
        }

        List<PostImageDTO> images = postImageMapper.findImagesByPostId(postId);
        post.setImages(images);

        boolean isOwner = loginUserId != null && loginUserId.equals(post.getUserId());
        post.setOwner(isOwner);

        return post;
    }

    @Transactional
    public void updatePost(Long postId, Long loginUserId, PostDTO updateDTO) {
        PostDTO originPost = postMapper.findPostById(postId);

        if (originPost == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        if (!originPost.getUserId().equals(loginUserId)) {
            throw new IllegalArgumentException("게시글 작성자만 수정할 수 있습니다.");
        }

        updateDTO.setPostId(postId);

        postMapper.updatePost(updateDTO);
    }

    @Transactional
    public void updatePostStatus(Long postId, Long loginUserId, String status) {
        PostDTO originPost = postMapper.findPostById(postId);

        if (originPost == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        if (!originPost.getUserId().equals(loginUserId)) {
            throw new IllegalArgumentException("게시글 작성자만 상태를 변경할 수 있습니다.");
        }

        if (!status.equals("SELLING") && !status.equals("RESERVED") && !status.equals("SOLD")) {
            throw new IllegalArgumentException("잘못된 판매 상태입니다.");
        }

        PostDTO postDTO = new PostDTO();
        postDTO.setPostId(postId);
        postDTO.setStatus(status);

        postMapper.updatePostStatus(postDTO);
    }

    @Transactional
    public void deletePost(Long postId, Long loginUserId) {
        PostDTO originPost = postMapper.findPostById(postId);

        if (originPost == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        if (!originPost.getUserId().equals(loginUserId)) {
            throw new IllegalArgumentException("게시글 작성자만 삭제할 수 있습니다.");
        }

        postMapper.deletePostImages(postId);
        postMapper.deletePost(postId);
    }
}