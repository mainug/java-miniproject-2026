package com.pknu26.usedtrade.controller;

import com.pknu26.usedtrade.dto.CommunityPostDTO;
import com.pknu26.usedtrade.dto.PostImageDTO;
import com.pknu26.usedtrade.security.CustomUserDetails;
import com.pknu26.usedtrade.service.CommunityPostService;
import com.pknu26.usedtrade.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostService communityPostService;
    private final FileService fileService;

    @GetMapping("/community")
    public String communityPage() {
        return "community/community";
    }

    @GetMapping("/community/{communityPostId}")
    public String communityDetailPage(
            @PathVariable("communityPostId") Long communityPostId,
            Model model) {
        CommunityPostDTO post = communityPostService.findCommunityPostById(communityPostId);
        List<PostImageDTO> images = communityPostService.findImagesByCommunityPostId(communityPostId);
        model.addAttribute("post", post);
        model.addAttribute("images", images);
        return "community/community-detail";
    }

    @GetMapping("/api/community/posts")
    @ResponseBody
    public List<CommunityPostDTO> findAllCommunityPosts() {
        return communityPostService.findAllCommunityPosts();
    }

    @PostMapping("/api/community/posts")
    @ResponseBody
    public String registerCommunityPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        CommunityPostDTO communityPostDTO = new CommunityPostDTO();
        communityPostDTO.setUserId(userDetails.getUser().getUserId());
        communityPostDTO.setTitle(title);
        communityPostDTO.setContent(content);
        communityPostDTO.setCategory(category);

        Long communityPostId = communityPostService.registerCommunityPost(communityPostDTO);

        fileService.saveCommunityPostImages(communityPostId, images);

        return "커뮤니티 게시글 등록 성공";
    }

    @PutMapping("/api/community/posts/{communityPostId}")
    @ResponseBody
    public ResponseEntity<String> updateCommunityPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("communityPostId") Long communityPostId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("category") String category) {
        CommunityPostDTO communityPostDTO = new CommunityPostDTO();
        communityPostDTO.setCommunityPostId(communityPostId);
        communityPostDTO.setTitle(title);
        communityPostDTO.setContent(content);
        communityPostDTO.setCategory(category);
        try {
            communityPostService.updateCommunityPost(communityPostDTO, userDetails.getUser().getUserId());
            return ResponseEntity.ok("커뮤니티 게시글 수정 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/api/community/posts/{communityPostId}")
    @ResponseBody
    public ResponseEntity<String> deleteCommunityPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("communityPostId") Long communityPostId) {
        try {
            communityPostService.deleteCommunityPost(communityPostId, userDetails.getUser().getUserId());
            return ResponseEntity.ok("커뮤니티 게시글 삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
