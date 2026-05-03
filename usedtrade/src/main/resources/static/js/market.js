const productWriteModal = document.querySelector("#productWriteModal");
const openProductWriteButton = document.querySelector(
  "#openProductWriteButton",
);
const closeProductWriteButton = document.querySelector(
  "#closeProductWriteButton",
);
const productWriteForm = document.querySelector("#productWriteForm");

// 세션으로 로그인해서 로그인 관련 localStorage 코드 제거_SY
// const loginUsername = document.querySelector("#loginUsername");
// const loginLink = document.querySelector("#loginLink");
// const logoutButton = document.querySelector("#logoutButton");

const marketStatus = document.querySelector("#marketStatus");
const productCount = document.querySelector("#productCount");
const productList = document.querySelector("#productList");

const searchForm = document.querySelector("#searchForm");
const keywordSearch = document.querySelector("#keywordSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");

const productImagesInput = document.querySelector("#productImages");
const imagePreviewList = document.querySelector("#imagePreviewList");

let products = [];

// function getUsername() {
  //   return localStorage.getItem("username");
  // }

function showStatus(message) {
  if (!marketStatus) return;

  marketStatus.textContent = message;
  marketStatus.classList.remove("hidden");
}

function hideStatus() {
  if (!marketStatus) return;

  marketStatus.textContent = "";
  marketStatus.classList.add("hidden");
}
//  세션으로 userName 가져와서 주석처리_SY
// function updateLoginArea() {
//   const username = getUsername();

//   if (username) {
//     loginUsername.textContent = username;
//     loginLink.classList.add("hidden");
//     logoutButton.classList.remove("hidden");
//   } else {
//     loginUsername.textContent = "비회원";
//     loginLink.classList.remove("hidden");
//     logoutButton.classList.add("hidden");
//   }
// }

function applySearchParams() {
  const params = new URLSearchParams(window.location.search);

  const keyword = params.get("keyword") || "";
  const category = params.get("category") || "ALL";
  const sort = params.get("sort") || "LATEST";

  keywordSearch.value = keyword;
  categoryFilter.value = category;
  sortFilter.value = sort;
}

function formatPrice(price) {
  return Number(price).toLocaleString() + "원";
}

function convertStatus(status) {
  if (status === "SELLING") return "판매중";
  if (status === "RESERVED") return "예약중";
  if (status === "SOLD") return "판매완료";
  return status || "판매중";
}

async function loadProducts() {
  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      showStatus("상품 목록을 불러오지 못했습니다.");
      return;
    }

    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error(error);
    showStatus("서버 연결에 실패했습니다.");
  }
}

function renderProducts() {
  const keyword = keywordSearch.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortFilter.value;

  let filteredProducts = [...products];

  if (keyword) {
    filteredProducts = filteredProducts.filter((product) => {
      const title = (product.title || "").toLowerCase();
      const content = (product.content || "").toLowerCase();
      const location = (product.location || "").toLowerCase();

      return (
        title.includes(keyword) ||
        content.includes(keyword) ||
        location.includes(keyword)
      );
    });
  }

  if (selectedCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory,
    );
  }

  if (selectedSort === "LATEST") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAtPosts || b.createdAt) -
        new Date(a.createdAtPosts || a.createdAt),
    );
  }

  if (selectedSort === "PRICE_ASC") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (selectedSort === "PRICE_DESC") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  productCount.textContent = filteredProducts.length;

  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
    return;
  }

  productList.innerHTML = filteredProducts
    .map((product) => {
      const createdAt = product.createdAtPosts || product.createdAt || "";
      const imageUrl = product.mainImageUrl;

      return `
        <article class="product-card">
          <div class="product-image">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${product.title}" />`
                : `<span>이미지 없음</span>`
            }
          </div>

          <div class="product-body">
            <h3>${product.title}</h3>
            <p>${product.content || ""}</p>

            <div class="product-meta">
              <strong>${formatPrice(product.price)}</strong>
              <span>${product.location || ""}</span>
            </div>

            <div class="product-status">
              ${convertStatus(product.status)}
            </div>

            <small class="created-at">
              등록일: ${createdAt ? createdAt.slice(0, 10) : ""}
            </small>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderImagePreview() {
  const files = Array.from(productImagesInput.files);

  if (files.length === 0) {
    imagePreviewList.innerHTML =
      '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
    return;
  }

  imagePreviewList.innerHTML = files
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

function resetImagePreview() {
  imagePreviewList.innerHTML =
    '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
}

function openProductWriteModal() {
  productWriteModal.classList.remove("hidden");
}

function closeProductWriteModal() {
  productWriteModal.classList.add("hidden");

  if (productWriteForm) {
    productWriteForm.reset();
  }

  resetImagePreview();
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const title = document.querySelector("#productTitle").value.trim();
  const price = document.querySelector("#productPrice").value.trim();
  const category = document.querySelector("#productCategory").value;
  const location = document.querySelector("#tradeLocation").value.trim();
  const content = document.querySelector("#productContent").value.trim();

  if (!title || !price || !content) {
    showStatus("상품명, 가격, 상품 설명을 입력하세요.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("location", location);
  formData.append("content", content);

  const files = productImagesInput.files;

  for (const file of files) {
    formData.append("images", file);
  }

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      showStatus("상품 등록에 실패했습니다.");
      return;
    }

    hideStatus();
    closeProductWriteModal();
    await loadProducts();
  } catch (error) {
    console.error(error);
    showStatus("서버 연결에 실패했습니다.");
  }
}

openProductWriteButton.addEventListener("click", openProductWriteModal);
closeProductWriteButton.addEventListener("click", closeProductWriteModal);

// 주석처리_SY
// logoutButton.addEventListener("click", () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("username");
//   updateLoginArea();
// });

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const keyword = keywordSearch.value.trim();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  const params = new URLSearchParams();

  if (keyword) {
    params.set("keyword", keyword);
  }

  params.set("category", category);
  params.set("sort", sort);

  location.href = `/products?${params.toString()}`;
});

categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);
productImagesInput.addEventListener("change", renderImagePreview);
productWriteForm.addEventListener("submit", handleProductSubmit);

// updateLoginArea();
applySearchParams();
loadProducts();
