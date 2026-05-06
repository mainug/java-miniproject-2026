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
