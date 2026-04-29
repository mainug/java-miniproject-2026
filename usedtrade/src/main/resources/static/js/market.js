const productWriteModal = document.querySelector('#productWriteModal');
const openProductWriteButton = document.querySelector('#openProductWriteButton');
const closeProductWriteButton = document.querySelector('#closeProductWriteButton');
const productWriteForm = document.querySelector('#productWriteForm');

const loginUsername = document.querySelector('#loginUsername');
const loginLink = document.querySelector('#loginLink');
const logoutButton = document.querySelector('#logoutButton');

const marketStatus = document.querySelector('#marketStatus');
const productCount = document.querySelector('#productCount');
const productList = document.querySelector('#productList');

const searchForm = document.querySelector('#searchForm');
const keywordSearch = document.querySelector('#keywordSearch');
const categoryFilter = document.querySelector('#categoryFilter');
const sortFilter = document.querySelector('#sortFilter');

const productImagesInput = document.querySelector('#productImages');
const imagePreviewList = document.querySelector('#imagePreviewList');

const products = [
  {
    id: 1,
    title: '중고 키보드 팝니다',
    content: '상태 좋습니다. 직거래 가능합니다.',
    price: 30000,
    category: 'DIGITAL',
    location: '부산 남구',
    status: '판매중',
    createdAt: '2026-04-28T10:30:00'
  },
  {
    id: 2,
    title: '모니터 판매합니다',
    content: '27인치 FHD 모니터입니다.',
    price: 80000,
    category: 'DIGITAL',
    location: '서울 강남구',
    status: '예약중',
    createdAt: '2026-04-29T09:10:00'
  },
  {
    id: 3,
    title: '책상 정리합니다',
    content: '사용감 조금 있습니다.',
    price: 20000,
    category: 'FURNITURE',
    location: '대구 수성구',
    status: '판매완료',
    createdAt: '2026-04-27T15:20:00'
  },
  {
    id: 4,
    title: '자바 책 판매',
    content: '정보처리기사 공부하면서 같이 봤던 책입니다.',
    price: 15000,
    category: 'BOOK',
    location: '부산 수영구',
    status: '판매중',
    createdAt: '2026-04-26T12:00:00'
  }
];

function setTestLogin() {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testUser');
  }
}

function getUsername() {
  return localStorage.getItem('username');
}

function showStatus(message) {
  if (!marketStatus) return;

  marketStatus.textContent = message;
  marketStatus.classList.remove('hidden');
}

function hideStatus() {
  if (!marketStatus) return;

  marketStatus.textContent = '';
  marketStatus.classList.add('hidden');
}

function updateLoginArea() {
  const username = getUsername();

  if (username) {
    loginUsername.textContent = username;
    loginLink.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    loginUsername.textContent = '비회원';
    loginLink.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }
}

function applySearchParams() {
  const params = new URLSearchParams(window.location.search);

  const keyword = params.get('keyword') || '';
  const category = params.get('category') || 'ALL';
  const sort = params.get('sort') || 'LATEST';

  keywordSearch.value = keyword;
  categoryFilter.value = category;
  sortFilter.value = sort;
}

function formatPrice(price) {
  return Number(price).toLocaleString() + '원';
}

function renderProducts() {
  const keyword = keywordSearch.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortFilter.value;

  let filteredProducts = [...products];

  if (keyword) {
    filteredProducts = filteredProducts.filter((product) => {
      const title = product.title.toLowerCase();
      const content = product.content.toLowerCase();
      const location = product.location.toLowerCase();

      return (
        title.includes(keyword) ||
        content.includes(keyword) ||
        location.includes(keyword)
      );
    });
  }

  if (selectedCategory !== 'ALL') {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  if (selectedSort === 'LATEST') {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (selectedSort === 'PRICE_ASC') {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (selectedSort === 'PRICE_DESC') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  productCount.textContent = filteredProducts.length;

  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
    return;
  }

  productList.innerHTML = filteredProducts
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-image">
          <span>이미지 없음</span>
        </div>

        <div class="product-body">
          <h3>${product.title}</h3>
          <p>${product.content}</p>

          <div class="product-meta">
            <strong>${formatPrice(product.price)}</strong>
            <span>${product.location}</span>
          </div>

          <div class="product-status">
            ${product.status}
          </div>

          <small class="created-at">
            등록일: ${product.createdAt.slice(0, 10)}
          </small>
        </div>
      </article>
    `
    )
    .join('');
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
    .join('');
}

function resetImagePreview() {
  imagePreviewList.innerHTML =
    '<p class="image-preview-empty">선택된 이미지가 없습니다.</p>';
}

function openProductWriteModal() {
  productWriteModal.classList.remove('hidden');
}

function closeProductWriteModal() {
  productWriteModal.classList.add('hidden');

  if (productWriteForm) {
    productWriteForm.reset();
  }

  resetImagePreview();
}

function handleProductSubmit(event) {
  event.preventDefault();

  const title = document.querySelector('#productTitle').value.trim();
  const price = document.querySelector('#productPrice').value.trim();
  const category = document.querySelector('#productCategory').value;
  const location = document.querySelector('#tradeLocation').value.trim();
  const content = document.querySelector('#productContent').value.trim();

  if (!title || !price || !content) {
    showStatus('상품명, 가격, 상품 설명을 입력하세요.');
    return;
  }

  products.unshift({
    id: products.length + 1,
    title,
    content,
    price: Number(price),
    category,
    location,
    status: '판매중',
    createdAt: new Date().toISOString()
  });

  hideStatus();
  closeProductWriteModal();
  renderProducts();
}

openProductWriteButton.addEventListener('click', openProductWriteModal);

closeProductWriteButton.addEventListener('click', closeProductWriteModal);

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  updateLoginArea();
});

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const keyword = keywordSearch.value.trim();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  const params = new URLSearchParams();

  if (keyword) {
    params.set('keyword', keyword);
  }

  params.set('category', category);
  params.set('sort', sort);

  location.href = `/index.html?${params.toString()}`;
});

categoryFilter.addEventListener('change', renderProducts);
sortFilter.addEventListener('change', renderProducts);
productImagesInput.addEventListener('change', renderImagePreview);

productWriteForm.addEventListener('submit', handleProductSubmit);

setTestLogin();
updateLoginArea();
applySearchParams();
renderProducts();