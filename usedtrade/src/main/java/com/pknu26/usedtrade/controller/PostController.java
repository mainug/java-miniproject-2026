package com.pknu26.usedtrade.controller;

import com.pknu26.usedtrade.dto.PostDTO;
import com.pknu26.usedtrade.security.CustomUserDetails;
import com.pknu26.usedtrade.service.FileService;
import com.pknu26.usedtrade.service.PostService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final FileService fileService;

    public PostController(PostService postService, FileService fileService) {
        this.postService = postService;
        this.fileService = fileService;
    }

    @GetMapping
    public List<PostDTO> findAllPosts() {
        return postService.findAllPosts();
    }

    @PostMapping
    public String registerPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("price") Long price,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        PostDTO postDTO = new PostDTO();

        postDTO.setUserId(userDetails.getUser().getUserId());
        postDTO.setBoardId(1L);
        postDTO.setTitle(title);
        postDTO.setContent(content);
        postDTO.setPrice(price);
        postDTO.setCategory(category);
        postDTO.setLocation(location);
        postDTO.setStatus("SELLING");

        Long postId = postService.registerPost(postDTO);

        fileService.savePostImages(postId, images);

        return "게시글 등록 성공";
    }
}