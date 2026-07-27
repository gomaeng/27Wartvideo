// 1. 카테고리별 영상 데이터 관리 (animation이 위로 오도록 교체)
const videoData = {
    animation: [
        "https://www.youtube.com/embed/nzPyVnQ3mNU?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/0JQd5jgnr5E?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/ZUtbGVN3laQ?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/lHXLtnuf99I?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/Og08SK7t9hU?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/5jP4Q4ufRgc?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/Cv-RiK5-T-c?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/3PoIwR-kzmU?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/QUpa6-AGMzQ?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/VaVQbRPibyg?enablejsapi=1&mute=1"
    ],
    virtual: [
        "https://www.youtube.com/embed/bAyoyEjoGTk?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/SF8A4xyqFao?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/IURzJyNKPeI?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/4Xw2OGb1Ov0?enablejsapi=1&mute=1",
        "https://www.youtube.com/embed/gV3tQwC8460?enablejsapi=1&mute=1"
    ]
};

let currentCategory = 'animation'; // 시작부터 애니메이션 고정
let currentIndex = 0;

const track = document.querySelector('.video-track');
const dotsContainer = document.querySelector('.video-dots');
const categoryNotice = document.getElementById('categoryNotice');

// 2. 모든 영상을 미리 렌더링
function renderSlides() {
    track.innerHTML = '';
    const urls = videoData[currentCategory];

    urls.forEach((url, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('video-slide');
        
        slideDiv.innerHTML = `
            <div class="video-frame">
                <iframe src="${url}" title="YouTube video ${index + 1}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
        track.appendChild(slideDiv);
    });
}

// 3. 인디케이터 점 자동 생성
function createDots() {
    dotsContainer.innerHTML = '';
    const totalSlides = videoData[currentCategory].length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentSlide(i);
        });
        
        dotsContainer.appendChild(dot);
    }
}

// 4. 슬라이드 위치 업데이트 및 안 보이는 영상 정지
function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    const dots = document.querySelectorAll('.video-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    const slides = document.querySelectorAll('.video-slide');
    slides.forEach((slide, index) => {
        const iframe = slide.querySelector('iframe');
        if (iframe && index !== currentIndex) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}

// 5. 좌우 버튼 이동
function moveSlide(direction) {
    const totalSlides = videoData[currentCategory].length;
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    updateSlide();
}

// 6. 특정 슬라이드로 이동
function currentSlide(index) {
    currentIndex = index;
    updateSlide();
}

// 7. 카테고리 전환 버튼 클릭 시 실행 함수
function switchCategory(category) {
    currentCategory = category;
    currentIndex = 0; 
    
    const tabs = document.querySelectorAll('.category-btn');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(category)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 문구 설정 (여기서 명확하게 분기 처리)
    if (categoryNotice) {
        if (currentCategory === 'animation') {
            categoryNotice.innerText = '커버곡 작업은 커버곡 영상으로 업로드합니다.';
        } else {
            categoryNotice.innerText = '쇼케이스 영상은 천천히 업로드하고 있습니다.';
        }
    }

    renderSlides();
    createDots();
    updateSlide();
}

// 페이지 로드 시 무조건 animation으로 시작 (맨 아래 코드는 이것 하나만 남겨두세요)
switchCategory('animation');
