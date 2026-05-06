const communityWriteModal = document.querySelector("#communityWriteModal");
const openCommunityWriteButton = document.querySelector("#openCommunityWriteButton");
const closeCommunityWriteButton = document.querySelector("#closeCommunityWriteButton");
const communityWriteForm = document.querySelector("#communityWriteForm");
const communityPostList = document.querySelector("#communityPostList");
const postCount = document.querySelector("#postCount");
const categoryFilter = document.querySelector("#categoryFilter");
const communityImagesInput = document.querySelector("#communityImages");
const communityImagePreviewList = document.querySelector("#communityImagePreviewList");

let posts = [];

function convertCategory(category) {
  if (category === "FREE") return "자유게시판";
  if (category === "LOCAL") return "동네정보";
  if (category === "REVIEW") return "거래후기";
  if (category === "QNA") return "질문게시판";
  return category;
}

async function loadCommunityPosts() {
  if (!communityPostList) return;

  try {
    const response = await fetch("/api/community/posts");

    if (!response.ok) {
      communityPostList.innerHTML = '<p class="empty">게시글을 불러오지 못했습니다.</p>';
      return;
    }

    posts = await response.json();
    renderCommunityPosts();
  } catch (error) {
    console.error(error);
    communityPostList.innerHTML = '<p class="empty">서버 연결에 실패했습니다.</p>';
  }
}

function renderCommunityPosts() {
  if (!communityPostList || !postCount) return;

  const selectedCategory = categoryFilter ? categoryFilter.value : "ALL";

  let filtered = [...posts];

  if (selectedCategory !== "ALL") {
    filtered = filtered.filter((post) => post.category === selectedCategory);
  }

  postCount.textContent = filtered.length;

  if (filtered.length === 0) {
    communityPostList.innerHTML = '<p class="empty">게시글이 없습니다.</p>';
    return;
  }

  communityPostList.innerHTML = filtered
    .map((post) => {
      const createdAt = post.createdAt || "";
      const imageUrl = post.mainImageUrl;

      return `
        <article class="product-card" style="cursor:pointer" onclick="location.href='/community/${post.communityPostId}'">
          ${imageUrl ? `
          <div class="product-image">
            <img src="${imageUrl}" alt="${post.title}" />
          </div>` : ""}

          <div class="product-body">
            <span class="product-status">${convertCategory(post.category)}</span>
            <h3>${post.title}</h3>
            <p>${post.content || ""}</p>

            <div class="product-meta">
              <span>${post.nickname || ""}</span>
              <small>${createdAt ? createdAt.slice(0, 10) : ""}</small>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderImagePreview() {
  if (!communityImagesInput || !communityImagePreviewList) return;

  const files = Array.from(communityImagesInput.files);

  if (files.length === 0) {
    communityImagePreviewList.innerHTML = '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
    return;
  }

  communityImagePreviewList.innerHTML = files
    .map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return `
        <div class="image-preview-item">
          <img src="${previewUrl}" alt="${file.name}" />
          <span>${file.name}</span>
        </div>
      `;
    })
    .join("");
}

function openCommunityWriteModal() {
  if (!communityWriteModal) return;
  communityWriteModal.classList.remove("hidden");
}

function closeCommunityWriteModalFn() {
  if (!communityWriteModal) return;
  communityWriteModal.classList.add("hidden");
  if (communityWriteForm) communityWriteForm.reset();
  if (communityImagePreviewList) {
    communityImagePreviewList.innerHTML = '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
  }
}

async function handleCommunitySubmit(event) {
  event.preventDefault();

  const title = document.querySelector("#communityTitle")?.value.trim();
  const content = document.querySelector("#communityContent")?.value.trim();
  const category = document.querySelector("#communityCategory")?.value;

  if (!title || !content) {
    alert("제목과 내용을 입력하세요.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);

  if (communityImagesInput) {
    for (const file of communityImagesInput.files) {
      formData.append("images", file);
    }
  }

  try {
    const response = await fetch("/api/community/posts", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("게시글 등록에 실패했습니다.");
      return;
    }

    closeCommunityWriteModalFn();
    await loadCommunityPosts();
  } catch (error) {
    console.error(error);
    alert("서버 연결에 실패했습니다.");
  }
}

if (openCommunityWriteButton) {
  openCommunityWriteButton.addEventListener("click", openCommunityWriteModal);
}

if (closeCommunityWriteButton) {
  closeCommunityWriteButton.addEventListener("click", closeCommunityWriteModalFn);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", renderCommunityPosts);
}

if (communityImagesInput) {
  communityImagesInput.addEventListener("change", renderImagePreview);
}

if (communityWriteForm) {
  communityWriteForm.addEventListener("submit", handleCommunitySubmit);
}

loadCommunityPosts();
