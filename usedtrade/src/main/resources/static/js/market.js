// ==============================
// 상품 등록 모달 관련 요소
// 로그인하지 않은 비회원 상태에서는 이 요소들이 HTML에 없을 수 있음
// 그래서 아래 이벤트 등록 시 반드시 null 체크가 필요함
// ==============================
const productWriteModal = document.querySelector("#productWriteModal");
const openProductWriteButton = document.querySelector(
  "#openProductWriteButton",
);
const closeProductWriteButton = document.querySelector(
  "#closeProductWriteButton",
);
const productWriteForm = document.querySelector("#productWriteForm");

// ==============================
// 상품 목록 화면에서 사용하는 요소
// ==============================
const marketStatus = document.querySelector("#marketStatus");
const productCount = document.querySelector("#productCount");
const productList = document.querySelector("#productList");

// ==============================
// 검색, 카테고리, 정렬 필터 요소
// ==============================
const searchForm = document.querySelector("#searchForm");
const keywordSearch = document.querySelector("#keywordSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");

// ==============================
// 상품 이미지 업로드 및 미리보기 요소
// 로그인하지 않은 경우 상품 등록 모달이 없으므로 null일 수 있음
// ==============================
const productImagesInput = document.querySelector("#productImages");
const imagePreviewList = document.querySelector("#imagePreviewList");

// 서버에서 받아온 상품 목록을 저장하는 배열
let products = [];

// ==============================
// 상태 메시지 표시 함수
// 예: 상품 목록 로딩 실패, 상품 등록 실패 등
// ==============================
function showStatus(message) {
  if (!marketStatus) return;

  marketStatus.textContent = message;
  marketStatus.classList.remove("hidden");
}

// 상태 메시지를 숨기는 함수
function hideStatus() {
  if (!marketStatus) return;

  marketStatus.textContent = "";
  marketStatus.classList.add("hidden");
}

// ==============================
// URL 쿼리스트링 값을 검색 필터에 반영하는 함수
// 예: /products?category=DIGITAL&sort=LATEST
//
// 현재는 검색 버튼을 눌러도 URL 이동을 하지 않지만,
// 나중에 URL 검색 조건을 다시 쓸 수 있으므로 유지함.
// ==============================
function applySearchParams() {
  if (!keywordSearch || !categoryFilter || !sortFilter) return;

  const params = new URLSearchParams(window.location.search);

  const keyword = params.get("keyword") || "";
  const category = params.get("category") || "ALL";
  const sort = params.get("sort") || "LATEST";

  keywordSearch.value = keyword;
  categoryFilter.value = category;
  sortFilter.value = sort;
}

// 가격 표시 형식 변환
// 예: 10000 -> 10,000원
function formatPrice(price) {
  return Number(price || 0).toLocaleString() + "원";
}

// 서버에서 받은 상품 상태값을 화면에 표시할 한글로 변환
function convertStatus(status) {
  if (status === "SELLING") return "판매중";
  if (status === "RESERVED") return "예약중";
  if (status === "SOLD") return "판매완료";
  return status || "판매중";
}

// ==============================
// 서버에서 상품 목록을 불러오는 함수
// 비회원도 상품 목록을 볼 수 있어야 하므로 로그인 여부와 관계없이 실행됨
// ==============================
async function loadProducts() {
  if (!productList) return;

  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      showStatus("상품 목록을 불러오지 못했습니다.");
      return;
    }

    // 서버에서 받은 상품 목록을 전역 배열에 저장
    products = await response.json();

    // 처음 페이지에 들어왔을 때 전체 상품 목록 출력
    renderProducts();
  } catch (error) {
    console.error(error);
    showStatus("서버 연결에 실패했습니다.");
  }
}

// ==============================
// 상품 목록을 화면에 렌더링하는 함수
//
// 이 함수가 실행되는 시점에 현재 입력/선택된 값을 읽음.
// 따라서 카테고리나 정렬 select에 별도 change 이벤트를 걸지 않아도,
// 검색 버튼을 누르는 순간 현재 값이 한 번에 적용됨.
// ==============================
function renderProducts() {
  if (!productList || !productCount) return;

  const keyword = keywordSearch ? keywordSearch.value.trim().toLowerCase() : "";
  const selectedCategory = categoryFilter ? categoryFilter.value : "ALL";
  const selectedSort = sortFilter ? sortFilter.value : "LATEST";

  // 원본 상품 배열을 직접 수정하지 않기 위해 복사본 생성
  let filteredProducts = [...products];

  // 검색어가 있으면 상품명, 설명, 거래 지역에서 검색
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

  // 전체가 아닌 특정 카테고리를 선택한 경우 해당 카테고리만 필터링
  if (selectedCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory,
    );
  }

  // 최신순 정렬
  if (selectedSort === "LATEST") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAtPosts || b.createdAt || 0) -
        new Date(a.createdAtPosts || a.createdAt || 0),
    );
  }

  // 가격 낮은순 정렬
  if (selectedSort === "PRICE_ASC") {
    filteredProducts.sort(
      (a, b) => Number(a.price || 0) - Number(b.price || 0),
    );
  }

  // 가격 높은순 정렬
  if (selectedSort === "PRICE_DESC") {
    filteredProducts.sort(
      (a, b) => Number(b.price || 0) - Number(a.price || 0),
    );
  }

  // 상품 개수 표시
  productCount.textContent = filteredProducts.length;

  // 검색 결과가 없을 때
  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
    return;
  }

  // 상품 카드 HTML 생성
  productList.innerHTML = filteredProducts
    .map((product) => {
      const createdAt = product.createdAtPosts || product.createdAt || "";
      const imageUrl = product.mainImageUrl;

      return `
        <article class="product-card" onclick="location.href='/posts/${product.postId}'">
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

// ==============================
// 상품 등록 시 선택한 이미지 파일을 미리보기로 보여주는 함수
// 로그인 사용자에게만 상품 등록 모달이 있으므로 비회원일 때는 실행되지 않음
// ==============================
function renderImagePreview() {
  if (!productImagesInput || !imagePreviewList) return;

  const files = Array.from(productImagesInput.files);

  if (files.length === 0) {
    imagePreviewList.innerHTML =
      '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
    return;
  }

  // 선택한 파일마다 임시 URL을 만들어 이미지 미리보기 출력
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

// 이미지 미리보기 영역 초기화
function resetImagePreview() {
  if (!imagePreviewList) return;

  imagePreviewList.innerHTML =
    '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
}

// 상품 등록 모달 열기
function openProductWriteModal() {
  if (!productWriteModal) return;

  productWriteModal.classList.remove("hidden");
}

// 상품 등록 모달 닫기
function closeProductWriteModal() {
  if (!productWriteModal) return;

  productWriteModal.classList.add("hidden");

  // 입력 폼 초기화
  if (productWriteForm) {
    productWriteForm.reset();
  }

  // 이미지 미리보기 초기화
  resetImagePreview();
}

// ==============================
// 상품 등록 폼 제출 처리 함수
// FormData를 이용해 텍스트 데이터와 이미지 파일을 함께 서버로 전송
// ==============================
async function handleProductSubmit(event) {
  event.preventDefault();

  const productTitleInput = document.querySelector("#productTitle");
  const productPriceInput = document.querySelector("#productPrice");
  const productCategoryInput = document.querySelector("#productCategory");
  const tradeLocationInput = document.querySelector("#tradeLocation");
  const productContentInput = document.querySelector("#productContent");

  // 상품 등록에 필요한 입력 요소가 없으면 중단
  if (
    !productTitleInput ||
    !productPriceInput ||
    !productCategoryInput ||
    !tradeLocationInput ||
    !productContentInput ||
    !productImagesInput
  ) {
    showStatus("상품 등록 화면을 찾을 수 없습니다.");
    return;
  }

  const title = productTitleInput.value.trim();
  const price = productPriceInput.value.trim();
  const category = productCategoryInput.value;
  const location = tradeLocationInput.value.trim();
  const content = productContentInput.value.trim();

  // 필수 입력값 검증
  if (!title || !price || !content || !category) {
    showStatus("상품명, 가격, 상품 설명, 카테고리를 입력하세요.");
    return;
  }

  // multipart/form-data 형식으로 보낼 데이터 생성
  const formData = new FormData();
  formData.append("title", title);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("location", location);
  formData.append("content", content);

  // 선택한 이미지 파일들을 FormData에 추가
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

    // 등록 성공 시 상태메시지 숨김
    hideStatus();

    // 모달 닫고 입력값 초기화
    closeProductWriteModal();

    // 상품 목록 다시 불러오기
    await loadProducts();
  } catch (error) {
    console.error(error);
    showStatus("서버 연결에 실패했습니다.");
  }
}

// ==============================
// 이벤트 등록 영역
// 로그인 여부에 따라 HTML에 없는 요소가 있을 수 있으므로
// addEventListener 전에 반드시 요소 존재 여부를 확인함
// ==============================

// 상품 등록 버튼 클릭 시 모달 열기
if (openProductWriteButton) {
  openProductWriteButton.addEventListener("click", openProductWriteModal);
}

// 모달 닫기 버튼 클릭 시 모달 닫기
if (closeProductWriteButton) {
  closeProductWriteButton.addEventListener("click", closeProductWriteModal);
}

// 검색 버튼 클릭 또는 검색창에서 Enter 입력 시 목록 다시 렌더링
//
// 여기서 renderProducts()가 실행되면서 현재 검색어, 카테고리, 정렬 값을 모두 읽음.
// 즉 카테고리/정렬 변경 자체는 아무 동작 안 하고,
// 검색 버튼을 눌렀을 때 한 번에 반영됨.
if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    renderProducts();
  });
}

// 카테고리 변경 이벤트는 일부러 등록하지 않음
// categoryFilter.addEventListener("change", renderProducts); 사용 안 함

// 정렬 변경 이벤트도 일부러 등록하지 않음
// sortFilter.addEventListener("change", renderProducts); 사용 안 함

// 이미지 선택 시 미리보기 렌더링
if (productImagesInput) {
  productImagesInput.addEventListener("change", renderImagePreview);
}

// 상품 등록 폼 제출 이벤트
if (productWriteForm) {
  productWriteForm.addEventListener("submit", handleProductSubmit);
}

// URL 검색 조건을 화면 필터에 반영
applySearchParams();

// 로그인 여부와 관계없이 상품 목록 불러오기
loadProducts();