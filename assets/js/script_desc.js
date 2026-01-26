//  ──────────────── canvas ────────────────
const circleCanvases = document.querySelectorAll(".circle-canvas");
const meteorCanvases = document.querySelectorAll(".meteor-canvas");

// 브라우저 창의 해상도가 변경될 시 canvas의 내부 해상도와 스타일 크기를 재설정
window.addEventListener("resize", () => {
    circleCanvases.forEach((circleCanvas) => {
        /* - JS에서 DOM 요소의 스타일에 접근하기 위해선 style 속성 또는 getComputedStyle()을 사용해야 함
             (단, style 속성 사용은 DOM 요소의 스타일을 HTML 태그 내 style 속성으로 지정한 경우만 가능)
           - JS에서 HTML 태그 내 속성은 직접 접근 가능
           - offsetWidth, offsetHeight: 브라우저가 기본 제공하는 HTML 태그 내 속성으로 해당 요소가 렌더링된 실제 크기를 제공 */
        let parentWidth = circleCanvas.closest("section").offsetWidth;
        let parentHeight = circleCanvas.closest("section").offsetHeight;

        /* - canvas의 내부 해상도를 설정
           - 일반 DOM 요소는 HTML 태그 내 width, height 속성이 없지만 canvas는 특별한 DOM 요소로 HTML 태그 내 width, height 속성이 존재 */
        circleCanvas.width = parentWidth;
        circleCanvas.height = parentHeight;

        /* - canvas의 스타일 크기를 설정
           - canvas의 내부 해상도와 스타일 크기를 일치시켜 canvas에 그린 도형의 왜곡을 방지
           - style 속성의 width와 height 속성 값은 단위를 포함한 문자열로 설정해야 함 */
        circleCanvas.style.width = `${parentWidth}px`;
        circleCanvas.style.height = `${parentHeight}px`;
    });

    meteorCanvases.forEach((meteorCanvas) => {
        let parentWidth = meteorCanvas.closest("section").offsetWidth;
        let parentHeight = meteorCanvas.closest("section").offsetHeight;

        meteorCanvas.width = parentWidth;
        meteorCanvas.height = parentHeight;

        meteorCanvas.style.width = `${parentWidth}px`;
        meteorCanvas.style.height = `${parentHeight}px`;
    });
});

// 깜빡이는 원 클래스
class Circle {
    /* JS에서는 별도의 필드 선언문 없이도 다양한 방법으로 필드를 동적 추가할 수 있음
       제일 권장되는 방법은 생성자 내 this 키워드를 이용하여 필드를 동적 추가하는 방법임 */
    constructor(xRatio, yRatio) {
        /* canvas에 그린 도형의 좌표는 절댓값이 아닌 상댓값(canvas 크기에 대한 비율)으로 지정해야
           반응형 레이아웃에서도 도형의 시각적 위치가 일관됨 */
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.radius = (Math.random() * 5) + 1;
        this.color = "#FC8A46";
        this.alpha = Math.random();
        // 투명도 방향 : 투명도를 증가시킬지/감소시킬지 결정
        this.alphaDirection = this.alpha >= 0.5 ? -1 : 1;
        // 변화량 : update() 시 투명도를 얼만큼 변화시킬지 결정
        this.speed = Math.random() * 0.01 + 0.005;
    }

    /* JS에서는 1) 클래스 멤버 함수 정의 시 2) 화살표 함수 정의 시
       3) 객체 메서드 축약형 정의 시 function 키워드 사용 X
       (+) 객체 메서드 축약형 : 객체 내 속성값으로 메서드를 정의할 시 속성명을 별도로 명시하지 않고
                               함수명을 속성명으로 지정한 형태 */
    // 투명도 및 투명도 방향을 업데이트하는 함수
    update() {
        this.alpha += this.alphaDirection * this.alpha;

        if (this.alpha >= 1.0) {
            this.alphaDirection = -1;
            this.alpha = 1.0;
        } else if (this.alpha <= 0.0) {
            this.alphaDirection = 1;
            this.alpha = 0.0;
        }
    }

    // 그리기 설정 및 canvas 내부 버퍼에 즉시 도형을 그리는 함수로, 화면에 보여지는 시점은 다음 프레임임
    draw(context, canvas) {
        // 이전 경로와 분리된 새로운 경로 시작
        context.beginPath();
        context.globalAlpha = this.alpha;
        context.shadowBlur = 5;
        context.shadowColor = this.color;
        context.fillStyle = this.color;
        // 호의 경로를 정의하는 함수 arc()를 이용하여 원의 경로를 정의
        context.arc(this.xRatio * canvas.width, this.yRatio * canvas.height, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

// 원 객체를 저장하는 배열
let circleArr = [];

// 원의 균일한 분포를 위해 캔버스 전체에 4*6의 가상 격자를 만들어 원의 중심 좌표를 설정
let rows = 4;
let cols = 6;
let rMaxOffset
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let xOffset = j + Math.random();
        let yOffset = i + Math.random();

        if (i === 0) {

        }
    }
}
function circleAnimation() {

}


//  ──────────────── recommend-sec ──────────────── 
const tabBtns = document.querySelectorAll(".tab-btn button");
const tabContents = document.querySelectorAll(".tab-content");
const colorLabels = document.querySelectorAll(".color label");
const storageLabels = document.querySelectorAll(".storage label");

// 초기 화면에 필요한 Swiper 객체 초기화
let recommendSwiperObj = recommendSwiper(tabContents[0]);

// 선택된 요소들의 부모 요소에 ".selected"를 제거하는 함수
function clearParentSelected(selector) {
    selector.forEach(
        (s) => { s.parentElement.classList.remove("selected"); }
    );
}

// 선택된 요소들에 ".selected"를 제거하는 함수
function clearCurrentSelected(selector) {
    selector.forEach(
        (s) => { s.classList.remove("selected"); }
    );
}

// 선택된 요소에 ".selected"를 추가하는 함수
function addSelected(selector) {
    selector.classList.add("selected");
}

// recommend-sec에서 사용할 Swiper 인스턴스를 생성하는 함수
function recommendSwiper(args) {
    let swiper = new Swiper(args.querySelector(".recommendSwiper"), {

        slidesPerView: 1,
        // spaceBetween이 적용되지 않는 순간이 있어서 모든 breakpoints에 spaceBetween 속성을 추가
        spaceBetween: 20,
        /* navigation이나 pagination이 넓은 범위를 가리키면 Swiper가 요소를 올바르게 못 찾을 수 있으므로
           querySelector()를 통해 좁은 범위로 지정 */
        navigation: {
            nextEl: args.querySelector(".swiper-button-next"),
            prevEl: args.querySelector(".swiper-button-prev"),
        },
        pagination: {
            el: args.querySelector(".swiper-pagination"),
            clickable: true,
        },

        breakpoints: {
            // 화면 너비가 1440px 이상일 때 적용
            1440: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            // slidesPerView에 소수점을 쓸 때 slidesPerGroup을 통해 마지막 카드가 한 번의 슬라이드로 온전히 보이게 함
            1200: {
                slidesPerView: 3.5,
                slidesPerGroup: 3,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2.5,
                slidesPerGroup: 2,
            },
            640: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 1.5,
                spaceBetween: 20
            },
            360: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
    });
    return swiper;
}

// 선택된 탭에 따라 보이는 추천 상품이 달라짐
tabBtns.forEach((tabBtn) => {
    tabBtn.addEventListener("click", function () {
        let idx = Array.from(tabBtns).indexOf(this);

        clearParentSelected(tabBtns);
        // 콜백 함수에서 this 키워드를 사용하려면 콜백은 function () {} 구조로 정의해야 함
        addSelected(this.parentElement);

        clearCurrentSelected(tabContents);
        addSelected(tabContents[idx]);

        // Swiper 객체가 중복 생성되지 않도록 기존 Swiper 객체 삭제
        if (recommendSwiperObj) {
            recommendSwiperObj.destroy(true, true);
        }

        // display: none 상태에서는 Swiper가 제대로 초기화되지 않으므로 addSelected() 호출 이후에 Swiper 객체 생성
        recommendSwiperObj = recommendSwiper(tabContents[idx]);
    });
});

// 선택된 색상에 따라 보이는 휴대폰 이미지가 달라짐
colorLabels.forEach((colorLabel) => {
    colorLabel.addEventListener("click", function () {
        let currentCard = this.closest(".recommend-card");
        let colorLabelsOfCurrentCard = currentCard.querySelectorAll("label");
        let dataImg = this.dataset.img;
        let img = currentCard.querySelector("img");

        clearParentSelected(colorLabelsOfCurrentCard);
        addSelected(this.parentElement);

        img.setAttribute("src", `./assets/images/phone/${dataImg}.webp`);
    });
});

// 선택된 용량에 따라 보이는 휴대폰 가격이 달라짐
storageLabels.forEach((storageLabel) => {
    storageLabel.addEventListener("click", function () {
        let currentCard = this.closest(".recommend-card");
        let storageLabelsOfCurrentCard = currentCard.querySelectorAll(".storage label");
        /* DOM의 data-*속성에서 *은 소문자 + 하이픈의 조합만 가능하며 JS에서는 해당 부분을 camelCase 방식으로 호출해야 함*/
        let dataBeforeCost = this.dataset.beforeCost;
        let dataAfterCost = this.dataset.afterCost;
        let beforeCostOfCurrentCard = currentCard.querySelector(".before-cost");
        let afterCostOfCurrentCard = currentCard.querySelector(".after-cost");

        clearParentSelected(storageLabelsOfCurrentCard);
        addSelected(this.parentElement);

        beforeCostOfCurrentCard.textContent = dataBeforeCost;
        afterCostOfCurrentCard.textContent = dataAfterCost;

    });
});

//  ──────────────── benefit-sec ────────────────
// gsap.utils.toArray(): 명시된 dom 요소를 JS 배열로 변환 
const benefitArr = gsap.utils.toArray(".benefit");


//  ──────────────── review-sec ──────────────── 
// review-sec에서 사용할 Swiper 인스턴스 생성
let reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: 4.2,
    spaceBetween: 30,
    autoplay: {
        delay: 2000,
        // 사용자가 조작하더라도 autoplay는 계속 유지
        disableOnInteraction: false,
    },
    // 마지막 슬라이드에서 첫 슬라이드로 이어지는 무한 루프 설정 
    loop: true
});

/* loop: true + slidesPerView: auto + 슬라이드 너비 고정 조합에서
   해상도 초기화 시점이나 리사이즈시 Swiper가 슬라이드 배치를 잘못 계산해서 
   맨 앞 슬라이드가 잘려 보이는 것을 방지 */
window.addEventListener("resize", () => {
    // 슬라이드 및 슬라이드 배치 재계산
    reviewSwiper.update();
    // 첫 슬라이드로 이동
    reviewSwiper.slideToLoop(0);
});