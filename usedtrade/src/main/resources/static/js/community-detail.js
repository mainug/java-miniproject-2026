const communityPostId = document.querySelector(".post-detail")?.dataset.postId;

const openEditButton = document.querySelector("#openEditButton");
const closeEditButton = document.querySelector("#closeEditButton");
const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editForm");
const deleteButton = document.querySelector("#deleteButton");

if (openEditButton) {
  openEditButton.addEventListener("click", () => {
    editModal.classList.remove("hidden");
  });
}

if (closeEditButton) {
  closeEditButton.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });
}

if (editForm) {
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#editTitle")?.value.trim();
    const content = document.querySelector("#editContent")?.value.trim();
    const category = document.querySelector("#editCategory")?.value;

    if (!title || !content) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    try {
      const response = await fetch(`/api/community/posts/${communityPostId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        alert("수정에 실패했습니다.");
        return;
      }

      editModal.classList.add("hidden");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  });
}

if (deleteButton) {
  deleteButton.addEventListener("click", async () => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/community/posts/${communityPostId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("삭제에 실패했습니다.");
        return;
      }

      location.href = "/community";
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  });
}

// ── 댓글 ──────────────────────────────────────────────

const commentFormWrapper = document.querySelector("#commentFormWrapper");
const commentForm = document.querySelector("#commentForm");
const commentList = document.querySelector("#commentList");
const commentCount = document.querySelector("#commentCount");
const loggedInUserId = commentFormWrapper ? Number(commentFormWrapper.dataset.userId) : null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadComments() {
  if (!commentList) return;

  try {
    const response = await fetch(`/api/community/posts/${communityPostId}/comments`);
    if (!response.ok) return;

    const comments = await response.json();
    if (commentCount) commentCount.textContent = comments.length;

    if (comments.length === 0) {
      commentList.innerHTML = '<p class="comment-empty">첫 댓글을 작성해보세요.</p>';
      return;
    }

    commentList.innerHTML = comments.map((c) => {
      const isAuthor = loggedInUserId !== null && c.userId === loggedInUserId;
      const date = c.createdAtComments ? c.createdAtComments.slice(0, 10) : "";
      return `
        <div class="comment-item" data-comment-id="${c.commentsId}">
          <div class="comment-meta">
            <div>
              <span class="comment-nickname">${escapeHtml(c.nickname)}</span>
              <small class="comment-date">${date}</small>
            </div>
            ${isAuthor ? `
            <div class="comment-actions">
              <button class="btn-secondary" onclick="startEditComment(${c.commentsId})">수정</button>
              <button class="btn-danger" onclick="deleteComment(${c.commentsId})">삭제</button>
            </div>` : ""}
          </div>
          <div class="comment-content">${escapeHtml(c.contentComments)}</div>
        </div>
      `;
    }).join("");
  } catch (error) {
    console.error(error);
  }
}

function startEditComment(commentsId) {
  const item = document.querySelector(`[data-comment-id="${commentsId}"]`);
  if (!item) return;

  const contentDiv = item.querySelector(".comment-content");
  const currentContent = contentDiv.textContent;

  contentDiv.innerHTML = `
    <textarea class="comment-edit-textarea">${escapeHtml(currentContent)}</textarea>
    <div class="comment-edit-actions">
      <button class="btn-secondary" onclick="submitEditComment(${commentsId})">저장</button>
      <button class="btn-secondary" onclick="loadComments()">취소</button>
    </div>
  `;
}

async function submitEditComment(commentsId) {
  const item = document.querySelector(`[data-comment-id="${commentsId}"]`);
  const content = item?.querySelector(".comment-edit-textarea")?.value.trim();

  if (!content) {
    alert("댓글 내용을 입력하세요.");
    return;
  }

  const formData = new FormData();
  formData.append("content", content);

  try {
    const response = await fetch(`/api/comments/${commentsId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      alert("수정에 실패했습니다.");
      return;
    }

    await loadComments();
  } catch (error) {
    console.error(error);
    alert("서버 연결에 실패했습니다.");
  }
}

async function deleteComment(commentsId) {
  if (!confirm("댓글을 삭제하시겠습니까?")) return;

  try {
    const response = await fetch(`/api/comments/${commentsId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("삭제에 실패했습니다.");
      return;
    }

    await loadComments();
  } catch (error) {
    console.error(error);
    alert("서버 연결에 실패했습니다.");
  }
}

if (commentForm) {
  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const content = document.querySelector("#commentContent")?.value.trim();
    if (!content) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    try {
      const response = await fetch(`/api/community/posts/${communityPostId}/comments`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("댓글 등록에 실패했습니다.");
        return;
      }

      document.querySelector("#commentContent").value = "";
      await loadComments();
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  });
}

loadComments();
