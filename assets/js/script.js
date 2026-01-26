//  ──────────────── canvas ────────────────
const circleCanvases = document.querySelectorAll(".circle-canvas");
const meteorCanvases = document.querySelectorAll(".meteor-canvas");

// 브라우저 창의 해상도가 변경될 시 canvas의 내부 해상도와 스타일 크기를 재설정
window.addEventListener("resize", () => {
    circleCanvases.forEach((circleCanvas) => {
        let parentWidth = circleCanvas.closest("section").offsetWidth;
        let parentHeight = circleCanvas.closest("section").offsetHeight;

        // canvas의 내부 해상도를 설정
        circleCanvas.width = parentWidth;
        circleCanvas.height = parentHeight;

        // canvas의 스타일 크기를 설정
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
    constructor(xRatio, yRatio) {
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.radius = (Math.random() * 5) + 1;
        this.alpha = Math.random();
        // 투명도 방향 : 투명도를 증가시킬지/감소시킬지 결정
        this.alphaDirection = this.alpha >= 0.5 ? -1 : 1;
        // 변화량 : update() 시 투명도를 얼만큼 변화시킬지 결정
        this.speed = Math.random() * 0.01 + 0.005;
    }

    // 투명도, 투명도 방향 업데이트
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
}


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
    slidesPerView: "auto",
    spaceBetween: 20,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    loop: true,
});

// 해상도 변화 시 맨 앞 슬라이드가 잘려 보이는 것을 방지
window.addEventListener("resize", () => {
    reviewSwiper.update();
    reviewSwiper.slideToLoop(0);
});