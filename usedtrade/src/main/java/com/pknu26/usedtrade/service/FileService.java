package com.pknu26.usedtrade.service;

import com.pknu26.usedtrade.dto.PostImageDTO;
import com.pknu26.usedtrade.mapper.PostImageMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final PostImageMapper postImageMapper;

    @Value("${file.upload-dir}")
    private String uploadPath;

    public FileService(PostImageMapper postImageMapper) {
        this.postImageMapper = postImageMapper;
    }

    public void savePostImages(Long postId, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return;
        }

        File uploadDir = new File(uploadPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);

            if (image.isEmpty()) {
                continue;
            }

            String originalName = image.getOriginalFilename();
            String extension = getExtension(originalName);
            String storedName = UUID.randomUUID() + extension;
            String imageUrl = "/uploads/" + storedName;

            try {
                image.transferTo(new File(uploadPath + storedName));
            } catch (Exception e) {
                throw new RuntimeException("이미지 저장 실패", e);
            }

            PostImageDTO postImageDTO = new PostImageDTO();
            postImageDTO.setPostId(postId);
            postImageDTO.setOriginalName(originalName);
            postImageDTO.setStoredName(storedName);
            postImageDTO.setImageUrl(imageUrl);
            postImageDTO.setIsMain(i == 0 ? "Y" : "N");

            postImageMapper.insertPostImage(postImageDTO);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}