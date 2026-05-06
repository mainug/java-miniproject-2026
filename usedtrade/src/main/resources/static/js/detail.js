const detailStatus = document.querySelector("#detailStatus");
const mainImageBox = document.querySelector("#mainImageBox");
const thumbnailList = document.querySelector("#thumbnailList");
const postCategory = document.querySelector("#postCategory");
const postTitle = document.querySelector("#postTitle");
const postPrice = document.querySelector("#postPrice");
const postLocation = document.querySelector("#postLocation");
const postStatus = document.querySelector("#postStatus");
const postCreatedAt = document.querySelector("#postCreatedAt");
const postViewCount = document.querySelector("#postViewCount");
const postContent = document.querySelector("#postContent");

function showDetailStatus(message) {
  if (!detailStatus) return;

  detailStatus.textContent = message;
  detailStatus.classList.remove("hidden");
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString() + "원";
}

function convertStatus(status) {
  if (status === "SELLING") return "판매중";
  if (status === "RESERVED") return "예약중";
  if (status === "SOLD") return "판매완료";
  return status || "판매중";
}

function convertCategory(category) {
  if (category === "DIGITAL") return "디지털기기";
  if (category === "FURNITURE") return "가구";
  if (category === "CLOTHES") return "의류";
  if (category === "BOOK") return "도서";
  if (category === "ETC") return "기타";
  return category || "기타";
}

function getPostIdFromPath() {
  const paths = window.location.pathname.split("/");
  return paths[paths.length - 1];
}

async function loadPostDetail() {
  const postId = getPostIdFromPath();

  if (!postId) {
    showDetailStatus("게시글 번호를 찾을 수 없습니다.");
    return;
  }

  try {
    const response = await fetch(`/api/posts/${postId}`);

    if (!response.ok) {
      showDetailStatus("게시글을 불러오지 못했습니다.");
      return;
    }

    const post = await response.json();
    renderPostDetail(post);
  } catch (error) {
    console.error(error);
    showDetailStatus("서버 연결에 실패했습니다.");
  }
}

function renderPostDetail(post) {
  postTitle.textContent = post.title || "";
  postPrice.textContent = formatPrice(post.price);
  postCategory.textContent = convertCategory(post.category);
  postLocation.textContent = post.location || "지역 정보 없음";
  postStatus.textContent = convertStatus(post.status);
  postContent.textContent = post.content || "";

  const createdAt = post.createdAtPosts || "";
  postCreatedAt.textContent = createdAt
    ? `등록일 ${createdAt.slice(0, 10)}`
    : "등록일 정보 없음";

  postViewCount.textContent = `조회수 ${post.viewCount || 0}`;

  const images = post.images || [];

  if (images.length === 0) {
    mainImageBox.innerHTML = "<span>이미지 없음</span>";
    thumbnailList.innerHTML = "";
    return;
  }

  mainImageBox.innerHTML = `
    <img src="${images[0].imageUrl}" alt="${post.title}" />
  `;

  thumbnailList.innerHTML = images
    .map(
      (image) => `
        <button type="button" class="detail-thumbnail">
          <img src="${image.imageUrl}" alt="${image.originalName || post.title}" />
        </button>
      `,
    )
    .join("");

  const thumbnailButtons = document.querySelectorAll(".detail-thumbnail");

  thumbnailButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      mainImageBox.innerHTML = `
        <img src="${images[index].imageUrl}" alt="${images[index].originalName || post.title}" />
      `;
    });
  });
}

loadPostDetail();