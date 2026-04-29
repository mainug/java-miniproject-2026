# DB

## ERD

<img width="908" height="666" alt="image" src="https://github.com/user-attachments/assets/8f376634-1589-45f9-b124-9b0ce68a5a87" />

## 테이블 생성 쿼리

```sql
-- 시퀀스
CREATE SEQUENCE seq_user_id START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_board_id START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_post_id START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_image_id START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_comments_id START WITH 1 INCREMENT BY 1 NOCACHE;

-- 1. 사용자 테이블
CREATE TABLE users (
    user_id NUMBER DEFAULT seq_user_id.NEXTVAL PRIMARY KEY,
    login_id VARCHAR2(50) NOT NULL UNIQUE, 
    user_name VARCHAR2(50) NOT NULL,        
    password VARCHAR2(255) NOT NULL,
    nickname VARCHAR2(50) NOT NULL,
    role VARCHAR2(20) NOT NULL,             
    phone VARCHAR2(30),
    created_at_user TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 게시판 테이블
CREATE TABLE boards (
    board_id NUMBER DEFAULT seq_board_id.NEXTVAL PRIMARY KEY,
    manager_id NUMBER NOT NULL,             
    CONSTRAINT fk_boards_users FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. 게시글 테이블
CREATE TABLE posts (
    post_id NUMBER DEFAULT seq_post_id.NEXTVAL PRIMARY KEY,
    user_id NUMBER NOT NULL,        
    buyer_id NUMBER,                
    board_id NUMBER NOT NULL,
    title VARCHAR2(200) NOT NULL,
    content_posts CLOB NOT NULL,
    price NUMBER NOT NULL,
    category VARCHAR2(50),
    location VARCHAR2(100),
    status VARCHAR2(20) DEFAULT 'SELLING' NOT NULL,
    view_count NUMBER DEFAULT 0 NOT NULL,
    created_at_posts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_posts_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_buyer FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_posts_boards FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE CASCADE
);

-- 4. 이미지 테이블
CREATE TABLE post_img (
    image_id NUMBER DEFAULT seq_image_id.NEXTVAL PRIMARY KEY,
    post_id NUMBER NOT NULL,
    original_name VARCHAR2(255),
    stored_name VARCHAR2(255) NOT NULL,
    image_url VARCHAR2(1000) NOT NULL,
    is_main CHAR(1) DEFAULT 'N' CHECK (is_main IN ('Y', 'N')),
    created_at_img TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_post_img_posts FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 5. 댓글 테이블
CREATE TABLE comments (
    comments_id NUMBER DEFAULT seq_comments_id.NEXTVAL PRIMARY KEY,
    user_id NUMBER NOT NULL,
    post_id NUMBER NOT NULL,
    content_comments CLOB NOT NULL,
    is_secret CHAR(1) DEFAULT 'N' CHECK (is_secret IN ('Y', 'N')),
    created_at_comments TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at_comments TIMESTAMP,

    CONSTRAINT fk_comments_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_posts FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);
```