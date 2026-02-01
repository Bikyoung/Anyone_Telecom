//  ──────────────── canvas ────────────────
const circleCanvasArr = document.querySelectorAll(".circle-canvas");

// canvas의 상위 section 크기와 동일하게 canvas의 해상도와 CSS 크기를 설정하는 함수
function setCanvasSize(canvas) {
    const parentSec = canvas.closest("section");
    const parentSecWidth = parentSec.offsetWidth;
    const parentSecHeight = parentSec.offsetHeight;

    canvas.width = parentSecWidth;
    canvas.height = parentSecHeight;

    canvas.style.width = `${parentSecWidth}px`;
    canvas.style.height = `${parentSecHeight}px`;
}

// 컨텍스트(ctx)의 속성을 설정하는 함수
function setupContext({ctx, fillStyle="#FC8A46", shadowColor="#FC8A46", shadowBlur=10} = {}) {
    ctx.fillStyle = fillStyle;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
}

class Circle {
    constructor(row, col, rows, cols) {
        this.xRatio = (Math.random() + col) / cols;         // 상대적 X 좌표
        this.yRatio = (Math.random() + row) / rows;         // 상대적 Y 좌표
        this.radius = (Math.random() * 2) + 1.5;            // 반지름: 1.5이상 3.5미만
        this.angle = Math.random() * Math.PI * 2;           // 초기 각도: 0 ~ 360도
        this.alpha = (Math.sin(this.angle) + 1) / 2;
        this.angleSpeed = (Math.random() * 0.05) + 0.005;   // 각도 변화량
    }

    // 투명도를 변화시키는 함수
    updateAlpha() {
        this.angle += this.angleSpeed;
        this.alpha = (Math.sin(this.angle) + 1) / 2;
    }

    // 원을 그리는 함수
    draw(canvasWidth, canvasHeight, ctx) {
        const x = canvasWidth * this.xRatio;    // 실제 x 좌표
        const y = canvasHeight * this.yRatio;   // 실제 y 좌표

        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// 모든 원을 그리고, 각 원의 투명도를 업데이트하며 다음 프레임에 애니메이션하는 함수
function drawCircleArr(circleCanvas, circleArr, ctx) {
    ctx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

    for(let i = 0; i < circleArr.length; i++) {    
        const circle = circleArr[i];

        circle.draw(circleCanvas.width, circleCanvas.height, ctx);
        circle.updateAlpha();
    }

    requestAnimationFrame(() => {
        drawCircleArr(circleCanvas, circleArr, ctx);
    });
}

// 모든 circleCanvas에 drawCircleArr()를 실행
circleCanvasArr.forEach((circleCanvas) => {
    const ctx = circleCanvas.getContext("2d");
    const circleArr = [];
    const rows = 4;
    const cols = 6;

    setCanvasSize(circleCanvas);
    setupContext({ctx: ctx});

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            const circle = new Circle(i, j, rows, cols);
            circleArr.push(circle);
        }
    }

    drawCircleArr(circleCanvas, circleArr, ctx);

    window.addEventListener("resize", () => {
        setCanvasSize(circleCanvas);
        setupContext({ctx: ctx});
    });
});

//  ──────────────── hero-sec ────────────────
const headerContainer = document.querySelector(".header-container");
const heroContainer = document.querySelector(".hero-container");

/* 뷰포트 상단에 고정된 header로 인해 hero 영역의 상단 여백이 부족해 보임
   이를 보완하기 위해 header 높이 + hero의 padding-bottom 값을 hero의 padding-top으로 동적 설정*/
function setHeroPaddingTop() {
    const headerHeight = headerContainer.offsetHeight;
    let heroPaddingBottom = getComputedStyle(heroContainer).paddingBottom;
    
    heroPaddingBottom = parseInt(heroPaddingBottom);
    heroContainer.style.paddingTop = `${headerHeight + heroPaddingBottom}px`;
}

setHeroPaddingTop();
window.addEventListener("resize", setHeroPaddingTop);

//  ──────────────── recommend-sec ──────────────── 
const tabBtns = document.querySelectorAll(".tab-btn button");
const tabContents = document.querySelectorAll(".tab-content");
const colorLabels = document.querySelectorAll(".color label");
const storageLabels = document.querySelectorAll(".storage label");

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
        spaceBetween: 20,
        navigation: {
            nextEl: args.querySelector(".swiper-button-next"),
            prevEl: args.querySelector(".swiper-button-prev"),
        },
        pagination: {
            el: args.querySelector(".swiper-pagination"),
            clickable: true,
        },

        breakpoints: {
            1440: {
                slidesPerView: 4,
                spaceBetween: 30
            },
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
                spaceBetween: 20
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
        addSelected(this.parentElement);

        clearCurrentSelected(tabContents);
        addSelected(tabContents[idx]);

        if (recommendSwiperObj) {
            recommendSwiperObj.destroy(true, true);
        }

        recommendSwiperObj = recommendSwiper(tabContents[idx]);
    });
});

// 선택된 색상에 따라 보이는 휴대폰 이미지가 달라짐
colorLabels.forEach((colorLabel) => {
    colorLabel.addEventListener("click", function () {
        let currentCard = this.closest(".recommend-card");
        let colorLabelsOfCurrentCard = currentCard.querySelectorAll(".color label");
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

const benefitRotateTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".benefit-sec",
        start: "top top",
        end: "+=300"
    }
});

// .benefit-sec이 뷰포트 상단에 닿으면 모든 .benefit이 시계 방향으로 15도씩 회전
benefitArr.forEach((benefit, idx) => {
    benefitRotateTl.to(benefit, {
        rotate: -15 * idx
    }, "<");
});

// 타임라인 종료 직후 benefitNextBtn 비활성화 해제
benefitRotateTl.call(() => {
    benefitNextBtn.disabled = false;
}, null, ">");

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
    slidesPerView: "auto",
    spaceBetween: 20,
    autoplay: {
        delay: 1200,
        disableOnInteraction: false,
    },
    loop: true,
});

// 해상도 변화 시 맨 앞 슬라이드가 잘려 보이는 것을 방지
window.addEventListener("resize", () => {
    reviewSwiper.update();
    reviewSwiper.slideToLoop(0);
});


//  ──────────────── modal ──────────────── 
const body = document.querySelector("body");
const showPrivacyArr = document.querySelectorAll(".show-privacy");
const footerTerms = document.querySelector(".footer-terms");
const modalOverlay = document.querySelector(".modal-overlay");
const privacyModal = document.querySelector(".privacy-modal");
const termsModal = document.querySelector(".terms-modal");
const showModalArr = document.querySelectorAll(".show-modal");
const closeModalArr = document.querySelectorAll(".close-modal");

// .show-modal 클릭 시 스크롤을 잠금하고 .modal-overlay 표시
showModalArr.forEach((showModal) => {
    showModal.addEventListener("click", ()=> {
        body.classList.add("stop-scroll");
        modalOverlay.style.display = "block";
    });
});

// .close-modal 클릭 시 스크롤 잠금을 해제하고 .modal-overlay와 해당 팝업을 숨김
closeModalArr.forEach((closeModal) => {
    const parentModal = closeModal.closest(".modal");

    closeModal.addEventListener("click", ()=> {
        body.classList.remove("stop-scroll");
        modalOverlay.style.display = "none";
        parentModal.style.display = "none";
    });
});

// .show-privacy 클릭 시 .privacy-modal 표시
showPrivacyArr.forEach((showPrivacy) => {
    showPrivacy.addEventListener("click", ()=> {
        privacyModal.style.display = "block";
    });
});

// .footer-terms 클릭 시 .terms-Modal 표시
footerTerms.addEventListener("click", ()=> {
    termsModal.style.display = "block";
});


//  ──────────────── contact-sec ──────────────── 
const requiredFieldArr = document.querySelectorAll(".required-field");
const nameInput = document.querySelector("#name");
const telInput = document.querySelector("#tel");
const contentInput = document.querySelector("#content");
const form = document.querySelector("form");
const validationModal = document.querySelector(".validation-modal");
const validationErrorMsg = document.querySelector(".validation-modal .error-msg");

// #tel의 입력값이 패턴에 부합하는지 확인용 RegExp 객체(정규식) 생성
const telPattern = new RegExp(telInput.pattern);

// .contact-form의 커스텀 유효성 검사 및 에러 메시지 표시
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isvalid = true;

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

//  ──────────────── slide-menu ──────────────── 
const hamburgerBtn = document.querySelector(".hamburger-btn");
const closeMenu = document.querySelector(".close-menu");
const slideMenu = document.querySelector(".slide-menu");
const slideMenuItemArr = document.querySelectorAll(".slide-menu a");

hamburgerBtn.addEventListener("click", ()=> {
    slideMenu.classList.add("show");
});

closeMenu.addEventListener("click", ()=> {
    slideMenu.classList.remove("show");
});

slideMenuItemArr.forEach((slideMenuItem) => {
    slideMenuItem.addEventListener("click", ()=> {
        slideMenu.classList.remove("show");
    });
});