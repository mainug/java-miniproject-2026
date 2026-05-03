# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 빌드
./gradlew build

# 실행 (Oracle DB가 로컬에서 실행 중이어야 함)
./gradlew bootRun

# 전체 테스트
./gradlew test

# 단일 테스트 클래스 실행
./gradlew test --tests "com.pknu26.usedtrade.UsedtradeApplicationTests"
```

## Architecture

Spring Boot 3.5 + MyBatis + Oracle XE 기반 중고거래 웹 앱. **JPA 미사용** — 모든 SQL은 `src/main/resources/mapper/*.xml`에 작성된 MyBatis XML Mapper로 관리한다.

### 요청 흐름

```
Browser → Controller → Service → Mapper(Interface) → Mapper.xml → Oracle DB
```

- **ViewController** — 페이지 라우팅만 담당 (`/`, `/login`)
- **UserController** — 회원가입 폼 처리 (`POST /users/join`), `@Valid` + `BindingResult` 패턴 사용
- **PostController** — REST API (`GET/POST /api/posts`), `@RequestParam`으로 multipart 수신

### MyBatis 주의사항

- Oracle 시퀀스로 PK 생성. 새 테이블 추가 시 시퀀스도 DDL에 포함해야 한다.
  - `seq_user_id.NEXTVAL` → users 테이블
  - `seq_post_id.NEXTVAL` → posts 테이블
- `mybatis.configuration.map-underscore-to-camel-case=true` 적용 중 — DB 컬럼 `created_at_posts`는 DTO의 `createdAtPosts`로 자동 매핑
- 예외: `content_posts` 컬럼은 DTO 필드명이 `content`라서 SQL에서 `AS content`로 직접 별칭 처리함
- `insertPost`는 `<selectKey order="BEFORE">`로 NEXTVAL을 먼저 조회한 뒤 INSERT — 이 방식으로 `postDTO.getPostId()`에서 생성된 PK를 바로 꺼낼 수 있다

### 파일 업로드

- 저장 경로: `file.upload-dir` (application.properties) → `uploads/` 디렉토리에 UUID 파일명으로 저장
- 서빙: `WebConfig`가 `/uploads/**` → `file:///{upload-dir}` 리소스 핸들러 등록
- DB 저장: `post_img` 테이블, `is_main = 'Y'` 인 첫 번째 이미지가 목록에 표시됨
- `file.upload-dir`은 로컬 절대 경로로 설정되어 있으므로 환경마다 다르게 설정 필요

### Spring Security

- CSRF 비활성화 상태 (개발 단계)
- 로그인 폼의 `name="username"` → `CustomUserDetailsService.loadUserByUsername()`에서 `loginId`로 조회
- `POST /api/posts`는 현재 `permitAll()` — 인증 없이 호출 가능

### Validation

- `UserJoinForm` / `UserLoginForm` — Controller 입력 전용 폼 객체 (`validation/` 패키지)
- DTO(`dto/` 패키지)는 DB 매핑 전용, 검증 어노테이션 없음
- `PostController`는 `@RequestParam` 방식이라 현재 `@Valid` 미적용 상태
