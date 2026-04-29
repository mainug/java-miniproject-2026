package com.pknu26.usedtrade.controller;

import com.pknu26.usedtrade.dto.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// 👇 이 컨트롤러는 특정 게시글(postId)에 달린 댓글들을 관리
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    /**
     * 1. 해당 게시글의 전체 댓글 조회
     */
    @GetMapping
    public ResponseEntity<ResponseDto<String>> getComments(@PathVariable Long postId) {
        // 나중에 MyBatis Service를 통해 DB에서 댓글 목록을 가져옴.
        ResponseDto<String> response = new ResponseDto<>(
                "success", 
                "댓글 조회 성공", 
                "여기에 [" + postId + "]번 게시글의 댓글 리스트가 들어갑니다."
        );
        return ResponseEntity.ok(response);
    }

    /**
     * 2. 댓글 작성
     */
    @PostMapping
    public ResponseEntity<ResponseDto<String>> addComment(
            @PathVariable Long postId
            // @RequestBody CommentDto commentDto // 나중에 프론트에서 작성한 댓글 내용이 여기로 오게됨.
    ) {
        // 요구사항에 아직 로그인 기능이 없으므로, 일단 작성자 ID를 1번 등으로 고정하여 테스트.
        ResponseDto<String> response = new ResponseDto<>(
                "success", 
                "댓글 작성 성공", 
                "성공적으로 댓글이 등록되었습니다."
        );
        return ResponseEntity.ok(response);
    }

    /**
     * 3. 댓글 삭제
     * URL 예시: /api/posts/5/comments/12 (5번 게시글의 12번 댓글 삭제)
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ResponseDto<String>> deleteComment(
            @PathVariable Long postId,    // 주소창의 {postId}를 가져옴
            @PathVariable Long commentId  // 주소창의 {commentId}를 가져옴
    ) {
        ResponseDto<String> response = new ResponseDto<>(
                "success", 
                "댓글 삭제 성공", 
                "[" + commentId + "]번 댓글이 삭제되었습니다."
        );
        return ResponseEntity.ok(response);
    }
}