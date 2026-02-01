//  ──────────────── canvas ────────────────
//  canvas의 상위 section 크기와 동일하게 canvas의 해상도와 CSS 크기를 설정하는 함수
function setCanvasSize(canvas) {
    // canvas와 가장 가까운 상위 section 요소를 찾음
    const parentSec = canvas.closest("section");
    // section 요소의 실제 너비와 높이를 가져옴
    const parentSecWidth = parentSec.offsetWidth;
    const parentSecHeight = parentSec.offsetHeight;

    /* - canvas의 해상도를 설정
       - 일반 DOM 요소는 HTML 태그 내 width, height 속성이 없지만 
         canvas는 특별한 DOM 요소로 HTML 태그 내 width, height 속성이 존재 */
    canvas.width = parentSecWidth;
    canvas.height = parentSecHeight;

    /* - canvas의 스타일 크기를 설정
       - canvas의 내부 해상도와 스타일 크기를 일치시켜 canvas에 그린 도형의 왜곡을 방지
       - style 속성의 width와 height 속성 값은 단위를 포함한 문자열로 설정해야 함 */
    canvas.style.width = `${parentSecWidth}px`;
    canvas.style.height = `${parentSecHeight}px`;
}

// 컨텍스트(ctx)의 속성을 설정하는 함수
const setupContext = function (ctx, fillStyle="#FC8A46", alpha, shadowColor="#FC8A46", shadowBlur=10) {
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
}

// JS 클래스 내부의 모든 곳에서 객체 속성을 가리킬 때는 반드시 this 사용
class Circle {
    constructor(row, col, rows, cols) {
        this.xRatio = (Math.random() + col) / cols;         // 상대적 X 좌표
        this.yRatio = (Math.random() + row) / rows;         // 상대적 Y 좌표
        this.radius = (Math.random() * 2) + 2;              // 반지름: 2이상 4미만
        this.angle = Math.random() * Math.PI * 2;           // 초기 각도: 0 ~ 360도
        this.alpha = (Math.sin(this.angle) + 1) / 2;
        this.angleSpeed = (Math.random() * 0.05) + 0.005;   // 각도 변화량
    }

    /* JS 클래스 내부에서 메서드를 정의할 때, 객체 메서드 축약형 정의 시에 function 키워드 사용 X
       (+) 객체 메서드 축약형 : 객체 내 속성값으로 메서드를 정의할 시 속성명을 별도로 명시하지 않고
       함수명을 속성명으로 지정한 형태 */
    // 투명도를 변화시키는 함수
    updateAlpha() {
        this.angle += this.angleSpeed;
        this.alpha = (Math.sin(this.angle) + 1) / 2;
    }

    // 원을 그리는 함수
    draw(canvasWidth, canvasHeight, ctx) {
        const x = canvasWidth * this.xRatio;    // 실제 x 좌표
        const y = canvasHeight * this.yRatio;   // 실제 y 좌표

        /* 새로운 도형의 그림 경로를 시작함
            이전에 그린 도형과 경로를 분리하기 위해 그림을 그리기 전에 항상 가장 먼저 호출해야 함 */
        ctx.beginPath();
        /* 호(arc)의 경로를 정의
           360도의 호는 원이므로 arc()는 원의 경로를 정의할 수 있음
           arc(x좌표, y좌표, 반지름, 시작각도, 끝각도, 반시계방향여부)
           각도는 라디안 단위(Math.PI)로 표현해야 함
           이 단계에서는 실제로 그림이 그려지지 않고 경로만 정의됨 */
        ctx.arc(x, y, 0, Math.PI * 2);
        // 경로 내부를 색으로 채워서 실제 그림을 그리는 단계
        ctx.fill();
        /* 현재 그림 경로를 종료함
           다음 도형을 그릴 때 beginPath()를 다시 호출한다면 생략 가능하지만,
           경로 관리의 안전성을 위해 명시적으로 호출하는 것이 좋음 */
        ctx.clearPath();
    }
}

// 실제 모든 원을 그리는 함수
function drawCircleArr(circleCanvas, circleArr, ctx) {
    /* 캔버스 전체를 지움
       이전 프레임에서 그려진 모든 원들을 지워서 새로운 상태만 보이게 함 */
    ctx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

    for(let i = 0; i < circleArr.length; i++) {    
        const circle = circleArr[i];

        circle.draw(circleCanvas.width, circleCanvas.height, ctx);
        circle.updateAlpha();
    }

    // requestAnimationFrame은 다음 프레임에 실행할 함수를 예약만 하므로 drawCircleArr는 즉시 종료됨
    requestAnimationFrame(() => {
        drawCircleArr(circleCanvas, circleArr, ctx);
    });
}


circleCanvasArr.forEach((circleCanvas) => {
    const ctx = circleCanvas.getContext("2d");
    const circleArr = [];
    const rows = 4;
    const cols = 6;

    setCanvasSize(circleCanvas);
    setupContext({ctx: ctx});

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 6; j++) {
            const circle = new Circle(i, j, rows, cols);
            circleArr.push(circle);
        }
    }

    drawCircleArr(circleCanvas, circleArr, ctx);

    window.addEventListener("resize", () => {
        setCanvasSize(circleCanvas);
        /* 캔버스의 HTML 속성 width/height를 재설정할 시 
           1) 캔버스를 새로 생성 2) 기존 그림 삭제 3)컨텍스트 리셋되므로 
           컨텍스트를 다시 설정해야 그림이 다시 그려짐 */
        setupContext({ctx: ctx});
    });
});


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
    constructor(row, col, rows, cols) {
        /* canvas에 그린 도형의 좌표는 절댓값이 아닌 상댓값(canvas 크기에 대한 비율)으로 지정해야
           반응형 레이아웃에서도 도형의 시각적 위치가 일관됨 */  
        this.xRatio = (Math.random() + col) / cols;         // 상대적 X 좌표
        this.yRatio = (Math.random() + row) / rows;         // 상대적 Y 좌표
        this.radius = (Math.random() * 2) + 2;              // 반지름: 2이상 4미만
        this.angle = Math.random() * Math.PI * 2;           // 초기 각도: 0 ~ 360도
        this.alpha = (Math.sin(this.angle) + 1) / 2;
        this.angleSpeed = (Math.random() * 0.05) + 0.005;   // 각도 변화량s
    }

    /* JS에서는 1) 클래스 멤버 함수 정의 시 2) 화살표 함수 정의 시
       3) 객체 메서드 축약형 정의 시 function 키워드 사용 X
       (+) 객체 메서드 축약형 : 객체 내 속성값으로 메서드를 정의할 시 속성명을 별도로 명시하지 않고
                               함수명을 속성명으로 지정한 형태 */
    // 투명도를 변화시키는 함수
    updateAlpha() {
        this.angle += this.angleSpeed;
        this.alpha = (Math.sin(this.angle) + 1) / 2;
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
const benefitArrowBtn = document.querySelectorAll(".benefit-arrow-btn");
const benefitNextBtn = document.querySelector(".benefit-next-btn");
const benefitPrevBtn = document.querySelector(".benefit-prev-btn");
const benefitIdx = document.querySelector(".benefit-idx");
const benefitDescArr = document.querySelectorAll(".benefit-desc");
let firstIdx = 0;

// .benefit-arrow-btn을 활성화/비활성화하는 함수
function disableArrowBtn(isDisabled) {
    benefitArrowBtn.forEach((btn) => {
        btn.disabled = isDisabled;
    });
}

// 첫번째 benefit의 desc 너비를 기준으로 나머지 카드의 desc 너비를 통일하는 함수
function setWidthDesc() {
    const width = benefitDescArr[0].offsetWidth;
    
    benefitDescArr.forEach((desc) => {
        desc.style.width = `${width}px`;
    });
}

setWidthDesc();
gsap.registerPlugin(ScrollTrigger);

// .benefit-sec이 뷰포트 상단에 닿으면 모든 .benefit이 시계 방향으로 15도씩 회전
const benefitRotateTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".benefit-sec",
        start: "top top",
        end: "center center",
        onLeave: () => {
            benefitNextBtn.disabled = false;
        }
    }
});

benefitArr.forEach((benefit, idx) => {
    benefitRotateTl.to(benefit, {
        rotate: -15 * idx
    }, "<");
});

// .benefit-next-btn 클릭 시 각 카드 회전 및 opacity/first 클래스 갱신
benefitNextBtn.addEventListener("click", () => {
    if(firstIdx >= 5) {
        return;
    }

    const benefitNextTl = gsap.timeline({
        onStart: () => {
            benefitIdx.textContent = firstIdx + 2;
            disableArrowBtn(true);
        },
        onComplete: () => {
            firstIdx += 1;
            disableArrowBtn(false);

            if(firstIdx >= 5) {
                benefitNextBtn.disabled = true;
            }
        }
    });
 
    benefitArr.forEach((benefit) => {
        benefitNextTl.to(benefit, {
            rotate: "+=15"
        }, "<");
    });

    if(benefitArr[firstIdx]) {
        benefitNextTl.to(benefitArr[firstIdx], {
            opacity: 0,
            onStart: () => {
                benefitArr[firstIdx].classList.remove("first");
            }
        }, "<");
    }

    if(benefitArr[firstIdx + 1]) {
        benefitNextTl.to(benefitArr[firstIdx + 1], {
            onStart: () => {
                benefitArr[firstIdx + 1].classList.add("first");
            }
        }, "<");
    }
});

// .benefit-prev-btn 클릭 시 각 카드 회전 및 opacity/first 클래스 갱신
benefitPrevBtn.addEventListener("click", () => {
    if(firstIdx <= 0) {
        return;
    }

    const benefitPrevTl = gsap.timeline({
        onStart: () => {
            benefitIdx.textContent = firstIdx;
            disableArrowBtn(true);
        },
        onComplete: () => {
            firstIdx -= 1;
            disableArrowBtn(false);

            if(firstIdx <= 0) {
                benefitPrevBtn.disabled = true;
            }
        }
    });
 
    benefitArr.forEach((benefit) => {
        benefitPrevTl.to(benefit, {
            rotate: "-=15"
        }, "<");
    });

    if(benefitArr[firstIdx]) {
        benefitPrevTl.to(benefitArr[firstIdx], {
            opacity: 1,
            onStart: () => {
                benefitArr[firstIdx].classList.remove("first");
            }
        }, "<");
    }

    if(benefitArr[firstIdx - 1]) {
        benefitPrevTl.to(benefitArr[firstIdx - 1], {
            opacity: 1,
            onStart: () => {
                benefitArr[firstIdx - 1].classList.add("first");
            }
        }, "<");
    }
}); 

window.addEventListener("resize", setWidthDesc);


//  ──────────────── review-sec ──────────────── 
// review-sec에서 사용할 Swiper 인스턴스 생성
let reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: 4.2,
    spaceBetween: 30,
    autoplay: {
        delay: 1200,
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

//  ──────────────── modal ──────────────── 
const body = document.querySelector("body");
const showPrivacyArr = document.querySelectorAll(".show-privacy");
const footerTerms = document.querySelector(".footer-terms");
const modalOverlay = document.querySelector(".modal-overlay");
const privacymodal = document.querySelector(".privacy-modal");
const termsmodal = document.querySelector(".terms-modal");
const showmodalArr = document.querySelectorAll(".show-modal");
const closemodalArr = document.querySelectorAll(".close-modal");

// .show-modal 클릭 시 스크롤 잠금 수행 및 .modal-overlay 표시
showmodalArr.forEach((showmodal) => {
    showmodal.addEventListener("click", ()=> {
        body.classList.add("stop-scroll");
        modalOverlay.style.display = "block";
    });
});

// .close-modal 클릭 시 스크롤 잠금을 해제하고 .modal-overlay와 해당 팝업을 숨김
closemodalArr.forEach((modalClose) => {
    const parentmodal = modalClose.closest(".modal");

    modalClose.addEventListener("click", ()=> {
        body.classList.remove("stop-scroll");
        modalOverlay.style.display = "none";
        parentmodal.style.display = "none";
    });
});

// .show-privacy 클릭 시 .privacy-modal 표시
showPrivacyArr.forEach((showPrivacy) => {
    showPrivacy.addEventListener("click", ()=> {
        privacymodal.style.display = "block";
    });
});

// .footer-terms 클릭 시 .terms-modal 표시
footerTerms.addEventListener("click", ()=> {
    termsmodal.style.display = "block";
});


//  ──────────────── contact-sec ──────────────── 
const requiredFieldArr = document.querySelectorAll(".required-field");
const nameInput = document.querySelector("#name");
const telInput = document.querySelector("#tel");
const contentInput = document.querySelector("#content");
const form = document.querySelector("form");
const validationModal = document.querySelector(".validation-modal");
const validationErrorMsg = document.querySelector(".validation-modal .error-msg");

/* 정규 표현식(RegExp) : 문자열을 특정한 규칙으로 정의한 표현식
   타 문자열이 규칙에 부합하는지 검사(match, test)하거나 규칙에 부합하는 부분 치환(replace)하는데 사용 */
// #tel의 입력값이 패턴에 부합하는지 확인용 RegExp 객체(정규식) 생성
const telPattern = new RegExp(telInput.pattern);

// .contact-form의 커스텀 유효성 검사 및 에러 메시지 표시
form.addEventListener("submit", (e) => {
    /* form 태그의 novalidate 속성: 브라우저 기본 유효성 검사를 막아 유효하지 않은 폼도 제출될 수 있음
       따라서 submit 이벤트 발생 시 e.preventDefault()로 기본 제출을 막고 커스텀 검사를 수행 */ 
    /* addEventListener 기본 동작
       : 첫 번째 매개변수로 지정된 이벤트 발생 시 브라우저가 해당 이벤트 객체를 생성해 콜백 함수의 첫 번째 매개변수로 전달 */ 
    // 현재 명시한 이벤트는 submit이므로, e는 submit 이벤트 객체이며 e.preventDefault()로 폼 제출을 방지
    e.preventDefault();
    // 전체 유효성 결과를 저장
    let isvalid = true;

    /* 모든 필수 입력 필드를 순회하며 값 존재 여부와 전화번호 패턴 일치 여부 검사
       하나라도 불만족 시 isvalid를 false로 설정 */
    requiredFieldArr.forEach((requiredField) => {
        if(requiredField.value.trim() === "" || !telPattern.test(telInput.value)) {
            isvalid = false;
        }
    });

    if(isvalid) {
        form.submit();
    } else {
        body.classList.add("stop-scroll");
        modalOverlay.style.display = "block";
        validationModal.style.display = "block";

        if(nameInput.value.trim() === "") {
            validationErrorMsg.textContent = nameInput.dataset.requiredMsg;
        } else if(telInput.value.trim() === "") {
            validationErrorMsg.textContent = telInput.dataset.requiredMsg;
        } else if(!telPattern.test(telInput.value)) {
            validationErrorMsg.textContent = telInput.dataset.patternMsg;
        } else if(!contentInput.value.trim() === "") {
            validationErrorMsg.textContent = contentInput.dataset.requiredMsg;
        }
    }
});