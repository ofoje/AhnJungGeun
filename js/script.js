/**
 * AhnJungGeun — 공통 JavaScript (베이스)
 * Unity WebView 프로토타입용
 */

/* --------------------------------------------------------------------------
   DOM Ready
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initModals();
  initButtons();
  initLoginPage();
  initIntroPage();
  initLifePage();
});

/* --------------------------------------------------------------------------
   Modal / Popup
   - ESC 키 닫기
   - 배경(Overlay) 클릭 닫기
   - 닫기 버튼 클릭 닫기
   -------------------------------------------------------------------------- */

/**
 * 페이지 내 모든 Modal 초기화
 */
function initModals() {
  const modals = document.querySelectorAll("[data-modal]");

  modals.forEach((modal) => {
    const modalId = modal.dataset.modal;
    const isAdvanceModal =
      modalId === "lifeDeepStudy" ||
      modalId === "lifeMapLearning" ||
      modalId === "lifeHistoryLearning";
    const overlay = document.querySelector(`[data-modal-overlay="${modalId}"]`);
    const closeButtons = modal.querySelectorAll("[data-modal-close]");

    /* 열기 트리거 */
    document.querySelectorAll(`[data-modal-open="${modalId}"]`).forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(modal, overlay);
      });
    });

    /* 닫기 버튼 — 심화학습은 initDeepStudyPopup에서 처리 */
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (isAdvanceModal) return;
        closeModal(modal, overlay);
      });
    });

    /* Overlay 클릭 — 심화학습은 X 버튼으로만 종료 */
    if (overlay && !isAdvanceModal) {
      overlay.addEventListener("click", () => closeModal(modal, overlay));
    }

    /* Modal 내부 클릭 시 닫히지 않도록 */
    modal.addEventListener("click", (e) => {
      if (e.target === modal && !isAdvanceModal) {
        closeModal(modal, overlay);
      }
    });
  });

  /* ESC 키 — 심화학습 팝업은 X 버튼으로만 종료 */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const deepStudyModal = document.querySelector('[data-modal="lifeDeepStudy"].is-active');
      const mapLearningModal = document.querySelector('[data-modal="lifeMapLearning"].is-active');
      const historyLearningModal = document.querySelector('[data-modal="lifeHistoryLearning"].is-active');
      if (deepStudyModal || mapLearningModal || historyLearningModal) return;
      closeAllModals();
    }
  });
}

/**
 * Modal 열기
 * @param {HTMLElement} modal
 * @param {HTMLElement|null} overlay
 */
function openModal(modal, overlay) {
  if (overlay) overlay.classList.add("is-active");
  modal.classList.add("is-active");
  document.body.classList.add("is-modal-open");
}

/**
 * Modal 닫기
 * @param {HTMLElement} modal
 * @param {HTMLElement|null} overlay
 */
function closeModal(modal, overlay) {
  if (overlay) overlay.classList.remove("is-active");
  modal.classList.remove("is-active");
  document.body.classList.remove("is-modal-open");
}

/**
 * 열려 있는 모든 Modal 닫기
 */
function closeAllModals() {
  document.querySelectorAll(".modal.is-active").forEach((modal) => {
    const modalId = modal.dataset.modal;
    const overlay = document.querySelector(`[data-modal-overlay="${modalId}"]`);
    closeModal(modal, overlay);
  });
}

/* --------------------------------------------------------------------------
   Button — Active 상태 관리
   -------------------------------------------------------------------------- */

/**
 * data-active-toggle 버튼 그룹 초기화 (Tab, Radio 등)
 */
function initButtons() {
  document.querySelectorAll("[data-active-toggle]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-active-item]");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Accordion
   -------------------------------------------------------------------------- */

/**
 * Accordion 초기화
 * @param {string} selector — accordion 컨테이너 선택자
 */
function initAccordion(selector) {
  const accordions = document.querySelectorAll(selector);

  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll("[data-accordion-item]");

    items.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const panel = item.querySelector("[data-accordion-panel]");

      if (!trigger || !panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        /* 단일 열림 모드 */
        if (accordion.dataset.accordionMode === "single") {
          items.forEach((i) => {
            i.classList.remove("is-open");
            i.querySelector("[data-accordion-panel]")?.setAttribute("hidden", "");
          });
        }

        if (isOpen) {
          item.classList.remove("is-open");
          panel.setAttribute("hidden", "");
        } else {
          item.classList.add("is-open");
          panel.removeAttribute("hidden");
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Fade Utility
   -------------------------------------------------------------------------- */

/**
 * 요소 Fade In
 * @param {HTMLElement} el
 * @param {number} duration — ms
 */
function fadeIn(el, duration = 300) {
  el.style.opacity = "0";
  el.style.transition = `opacity ${duration}ms ease`;

  requestAnimationFrame(() => {
    el.style.opacity = "1";
  });
}

/**
 * 요소 Fade Out
 * @param {HTMLElement} el
 * @param {number} duration — ms
 * @returns {Promise<void>}
 */
function fadeOut(el, duration = 300) {
  return new Promise((resolve) => {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = "0";

    setTimeout(resolve, duration);
  });
}

/* --------------------------------------------------------------------------
   Login Page
   -------------------------------------------------------------------------- */

/**
 * 로그인 페이지 초기화
 */
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", handleLoginSubmit);
}

/**
 * 로그인 폼 제출 처리
 * @param {SubmitEvent} e
 */
function handleLoginSubmit(e) {
  e.preventDefault();

  const serialNumber = document.getElementById("serialNumber")?.value.trim();
  const userName = document.getElementById("userName")?.value.trim();

  navigateToNextPage(serialNumber, userName);
}

/**
 * 로그인 완료 후 다음 페이지로 이동
 * @param {string} serialNumber — 시리얼 번호
 * @param {string} userName — 이름
 */
function navigateToNextPage(serialNumber, userName) {
  // TODO: 다음 페이지 경로 지정
  window.location.href = "pages/intro.html";

  console.log("로그인 정보:", { serialNumber, userName });
}

/* --------------------------------------------------------------------------
   Intro Page
   -------------------------------------------------------------------------- */

/**
 * 인트로 페이지 초기화
 */
function initIntroPage() {
  const startBtn = document.getElementById("startBtn");
  const lifeCard = document.querySelector(".intro-card");

  if (startBtn) {
    startBtn.addEventListener("click", handleIntroStart);
  }

  if (lifeCard) {
    lifeCard.style.cursor = "pointer";
    lifeCard.addEventListener("click", navigateFromIntro);
  }
}

/**
 * 시작하기 버튼 클릭 처리
 */
function handleIntroStart() {
  navigateFromIntro();
}

/**
 * 인트로 완료 후 life 페이지로 이동
 */
function navigateFromIntro() {
  window.location.href = "life.html";
}

/* --------------------------------------------------------------------------
   Life Page
   -------------------------------------------------------------------------- */

let narrationTimerId = null;
let narrationIndex = 0;
let currentLifeIndex = 0;
let hasSeenDeepStudyPopup = false;
let hasSeenMapLearningPopup = false;
let hasSeenHistoryLearningPopup = false;

const NARRATION_INTERVAL_MS = 2500;

const lifeContents = [
  {
    id: "birth",
    pageTitle: "안중근 — 안응칠, 태어나다",
    chapter: "1. 안중근의 어린시절",
    heading: "안응칠, 태어나다.",
    image: "../images/life/child_01.png",
    imageAlt: "해주에서 태어난 안응칠의 어린 시절 일러스트",
    tocSection: 1,
    tocIndex: 0,
    lines: [
      { text: "1879년 9월 2일 황해도 해주에서 아버지 안태훈과 어머니 조마리아의 3남 1녀 중 장남으로 태어났어요." },
      { text: "태어났을 때부터 있던 7개의 점 때문에 ‘안응칠’이라고 불렀어요." },
    ],
  },
  {
    id: "childhood",
    pageTitle: "안중근 — 청계동에서 어린시절을 보내다",
    chapter: "1. 안중근의 어린시절",
    heading: "청계동에서 어린시절을 보내다.",
    image: "../images/life/child_02.png",
    imageAlt: "청계동에서 어린시절을 보낸 안중근 일러스트",
    tocSection: 1,
    tocIndex: 1,
    deepStudyBeforeNext: true,
    lines: [
      { text: "어린시절 동안 안중근은 공부뿐만 아니라 활쏘기와 말타기도 열심히 하였어요." },
      {
        text: "첫째 아들로 두 남동생과 여동생 한 명이 있었어요.",
        popupLinks: [
          {
            word: "첫째 아들로 두 남동생과 여동생 한 명이 있었어요.",
            popupId: "family",
          },
        ],
      },
    ],
  },
  {
    id: "youth",
    pageTitle: "안중근 — 도마 안중근, 구국운동에 뛰어들다",
    chapter: "2. 청년 안중근",
    heading: "도마 안중근, 구국운동에 뛰어들다.",
    image: "../images/life/youth_01.png",
    imageAlt: "도마 안중근, 구국운동에 뛰어들다 일러스트",
    tocSection: 2,
    tocIndex: 2,
    lines: [
      { text: "18살이 된 안중근은 천주교신자가 되어 THOMAS(도마)라는 세례명을 받게 되었어요." },
      { text: "러시아와의 전쟁에서 이긴 일본은 1905년 우리나라의 외교권마저 빼앗아 갔어요." },
    ],
  },
  {
    id: "youth-education",
    pageTitle: "안중근 — 교육활동에 힘쓰다",
    chapter: "2. 청년 안중근",
    heading: "교육활동에 힘쓰다.",
    image: "../images/life/youth_02.png",
    imageAlt: "교육활동에 힘쓴 안중근 일러스트",
    tocSection: 2,
    tocIndex: 3,
    lines: [
      { text: "안중근은 민족의 힘을 기르기 위해 우리나라의 교육과 산업을 발전시키고자 노력했어요." },
    ],
  },
  {
    id: "youth-army",
    pageTitle: "안중근 — 의병을 이끌다",
    chapter: "2. 청년 안중근",
    heading: "의병을 이끌다.",
    image: "../images/life/youth_03.png",
    imageAlt: "의병을 이끈 안중근 일러스트",
    tocSection: 2,
    tocIndex: 4,
    lines: [
      { text: "일본의 탄압으로 국내에서 활동이 어려워지자 안중근은 러시아 블라디보스토크로 갔어요." },
      {
        text: '그리고 연해주 지역 의병 부대를 이끄는 "대한의군 참모중장"이 되었어요.',
        popupLinks: [{ word: "의병", popupId: "army" }],
      },
    ],
  },
  {
    id: "youth-alliance",
    pageTitle: "안중근 — 단지동맹을 맺다",
    chapter: "2. 청년 안중근",
    heading: "단지동맹을 맺다.",
    image: "../images/life/youth_04.png",
    imageAlt: "단지동맹을 맺은 안중근 일러스트",
    tocSection: 2,
    tocIndex: 5,
    mapLearningBeforeNext: true,
    lines: [
      {
        text: '1909년 일본과의 전투에서 지자 안중근은 같은 의병 동지들과 동의단지회(단지동맹)을 만들었어요. 왼손 네번째 손가락 첫마디를 잘라 그 피로 태극기에 "대한독립"이라 썼어요.',
        popupLinks: [
          {
            word: '태극기에 "대한독립"이라 썼어요.',
            popupId: "finger",
          },
        ],
      },
    ],
  },
  {
    id: "harbin-plan",
    pageTitle: "안중근 — 의거 계획을 세우다",
    chapter: "3. 하얼빈 의거",
    heading: "의거 계획을 세우다.",
    image: "../images/life/harbin_01.png",
    imageAlt: "의거 계획을 세우다 일러스트",
    tocSection: 3,
    tocIndex: 6,
    lines: [
      { text: "러시아의 블라디보스토크에서 안중근은 우리나라 침략에 앞장선 이토 히로부미가 블라디보스토크에 온다는 것을 알게 되었어요." },
    ],
  },
  {
    id: "harbin-plan-2",
    pageTitle: "안중근 — 의거 계획을 세우다",
    chapter: "3. 하얼빈 의거",
    heading: "의거 계획을 세우다.",
    image: "../images/life/harbin_02.png",
    imageAlt: "동지들과 의거 계획을 논의하는 안중근 일러스트",
    tocSection: 3,
    tocIndex: 6,
    lines: [
      { text: "독립운동가 우덕순, 조도선, 유동하와 함께 이토 히로부미를 처단하는 의거를 실행하기로 했어요." },
    ],
  },
  {
    id: "harbin-assassination",
    pageTitle: "안중근 — 이토 히로부미를 처단하다",
    chapter: "3. 하얼빈 의거",
    heading: "이토 히로부미를 처단하다.",
    image: "../images/life/harbin_03.png",
    imageAlt: "하얼빈역에 도착한 이토 히로부미 일러스트",
    tocSection: 3,
    tocIndex: 8,
    lines: [
      { text: "1909년 10월 26일 오전 9시 즈음, 하얼빈 기차역에 이토 히로부미를 태운 기차가 도착했어요." },
    ],
  },
  {
    id: "harbin-assassination-2",
    pageTitle: "안중근 — 이토 히로부미를 처단하다",
    chapter: "3. 하얼빈 의거",
    heading: "이토 히로부미를 처단하다.",
    image: "../images/life/harbin_04.png",
    imageAlt: "이토 히로부미를 처단하는 안중근 일러스트",
    tocSection: 3,
    tocIndex: 8,
    lines: [
      { text: '그가 열차에서 내리자 안중근은 이토 히로부미에게 총을 쏘았고 "코레아 우라(대한만세)"를 외쳤어요.' },
    ],
  },
  {
    id: "harbin-independence",
    pageTitle: "안중근 — 한국의 독립 의지를 알리다",
    chapter: "3. 하얼빈 의거",
    heading: "한국의 독립 의지를 알리다.",
    image: "../images/life/harbin_05.png",
    imageAlt: "한국의 독립 의지를 알린 안중근 일러스트",
    tocSection: 3,
    tocIndex: 10,
    historyLearningBeforeNext: true,
    lines: [
      { text: "안중근 의거를 계기로 한국의 독립운동은 전 세계에 알려졌어요." },
    ],
  },
  {
    id: "peace-trial",
    pageTitle: "안중근 — 뤼순 감옥에 갇혀 재판을 받다",
    chapter: "4. 동양 평화를 소망한 안중근",
    heading: "뤼순 감옥에 갇혀 재판을 받다.",
    image: "../images/life/peace_01.png",
    imageAlt: "뤼순 감옥에서 재판을 받는 안중근 일러스트",
    tocSection: 4,
    tocIndex: 11,
    lines: [
      { text: "안중근은 뤼순 감옥에 갇히게 되었어요." },
      { text: "일본 법정에 선 안중근은 의병장 자격으로 적을 처단한 것이기 때문에 만국공법을 자신에게 적용해 달라고 주장했어요." },
    ],
  },
  {
    id: "peace-writing",
    pageTitle: "안중근 — 감옥 안에서 글을 남기다",
    chapter: "4. 동양 평화를 소망한 안중근",
    heading: "감옥 안에서 글을 남기다.",
    image: "../images/life/peace_02.png",
    imageAlt: "감옥 안에서 글을 쓰는 안중근 일러스트",
    tocSection: 4,
    tocIndex: 12,
    lines: [
      {
        text: "그리고 뤼순 감옥에서 자서전 <안응칠 역사>와 <동양평화론>이라는 책을 썼어요.",
        popupLinks: [
          { word: "<안응칠 역사>", popupId: "bookHistory" },
          { word: "<동양평화론>", popupId: "bookPeace" },
        ],
      },
    ],
  },
  {
    id: "peace-martyrdom",
    pageTitle: "안중근 — 사형장에서 순국하다",
    chapter: "4. 동양 평화를 소망한 안중근",
    heading: "사형장에서 순국하다.",
    image: "../images/life/peace_03.png",
    imageAlt: "사형장에서 순국하는 안중근 일러스트",
    tocSection: 4,
    tocIndex: 13,
    lines: [
      {
        text: "1910년 3월 26일, 안중근은 뤼순 감옥에서 32세의 나이로 돌아가셨어요.",
        popupLinks: [
          {
            word: "안중근은 뤼순 감옥에서 32세의 나이로 돌아가셨어요.",
            popupId: "martyrPhoto",
            linkClass: "narration-link--keyword-peace",
          },
        ],
      },
      {
        text: "대한민국 정부는 조국 독립과 동양평화를 위해 목숨을 바친 안중근에게 1962년 건국훈장 대한민국장을 수여하였어요.",
      },
    ],
  },
];

const lifePopups = {
  family: {
    image: "../images/life/popup_family.png",
    imageAlt: "안중근 가족사진",
    title: "안중근 가족사진",
    description: "안중근의 아버지(안태훈)와 두 동생(안정근, 안공근)",
  },
  army: {
    image: "../images/life/popup_army.png",
    imageAlt: "의병(1907년)",
    title: "의병(1907년)",
    description: "나라를 지키기 위해 스스로 군대를 일으킨 사람들",
  },
  finger: {
    image: "../images/life/popup_finger.png",
    imageAlt: "피로 대한독립이라고 써진 태극기",
    title: "피로 대한독립이라고 써진 태극기",
    description: "[역사활동] 大韓獨立을 (한글)대한독립임을 알고 뜻 알아보기",
  },
  bookHistory: {
    image: "../images/life/popup_book_01.png",
    imageAlt: "안응칠 역사",
    title: "안응칠 역사",
    description: "안중근 의사가 뤼순감옥에서 직접 집필한 자서전",
  },
  bookPeace: {
    image: "../images/life/popup_book_02.png",
    imageAlt: "동양 평화론",
    title: "동양 평화론",
    description: "안중근 의사가 순국을 앞두고 동양 평화에 대한 자신의 신념을 집약하여 쓴 글",
  },
  martyrPhoto: {
    image: "../images/life/popup_photo.png",
    imageAlt: "순국 직전 안중근 의사",
    title: "순국 직전 안중근 의사",
  },
};

/**
 * 일생 학습 페이지 초기화
 */
function initLifePage() {
  if (!document.querySelector(".life-page")) return;

  initLifeNavigation();
  initLifePopupTriggers();
  initDeepStudyPopup();
  initMapLearningPopup();
  initHistoryLearningPopup();
  renderLifeContent(currentLifeIndex);
  updateLifeToc(currentLifeIndex);
  updateLifeNavButtons();

  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.addEventListener("click", toggleSound);
  }
}

/**
 * 이전/다음 및 목차 네비게이션 초기화
 */
function initLifeNavigation() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const tocLinks = document.querySelectorAll(".life__sidebar [data-life-index]");

  prevBtn?.addEventListener("click", () => {
    if (currentLifeIndex > 0) {
      goToLifeContent(currentLifeIndex - 1);
    }
  });

  nextBtn?.addEventListener("click", handleLifeNext);

  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = Number(link.dataset.lifeIndex);
      if (!Number.isNaN(index)) {
        goToLifeContent(index);
      }
    });
  });
}

/**
 * 다음 버튼 처리 — 심화학습 팝업 후 이동
 */
function handleLifeNext() {
  const content = lifeContents[currentLifeIndex];
  if (!content) return;

  if (content.historyLearningBeforeNext && !hasSeenHistoryLearningPopup) {
    openHistoryLearning();
    return;
  }

  if (content.mapLearningBeforeNext && !hasSeenMapLearningPopup) {
    openMapLearning();
    return;
  }

  if (content.deepStudyBeforeNext && !hasSeenDeepStudyPopup) {
    openDeepStudyPopup();
    return;
  }

  if (currentLifeIndex < lifeContents.length - 1) {
    goToLifeContent(currentLifeIndex + 1);
    return;
  }

  // TODO: 일생 학습 마지막 콘텐츠 완료 후 '나만의 전시관 만들기' 등 다음 플로우로 이동
}

/**
 * 심화학습 팝업 초기화 — X 버튼 클릭 시 청년 안중근 첫 콘텐츠로 이동
 */
function initDeepStudyPopup() {
  const modal = document.querySelector('[data-modal="lifeDeepStudy"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeDeepStudy"]');
  if (!modal) return;

  const youthIndex = lifeContents.findIndex((content) => content.id === "youth");

  const completeDeepStudyAndAdvance = () => {
    hasSeenDeepStudyPopup = true;
    closeModal(modal, overlay);
    if (youthIndex >= 0) {
      goToLifeContent(youthIndex);
    }
  };

  modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      completeDeepStudyAndAdvance();
    });
  });
}

/**
 * 심화학습 팝업 열기
 */
function openDeepStudyPopup() {
  const modal = document.querySelector('[data-modal="lifeDeepStudy"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeDeepStudy"]');
  if (!modal || !overlay) return;

  openModal(modal, overlay);
}

/**
 * 지도 심화학습 팝업 초기화 — X 버튼 클릭 시 하얼빈 의거 첫 콘텐츠로 이동
 */
function initMapLearningPopup() {
  const modal = document.querySelector('[data-modal="lifeMapLearning"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeMapLearning"]');
  if (!modal) return;

  modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      finishMapAnimation();
    });
  });
}

/**
 * 지도 심화학습 팝업 열기
 */
function openMapLearning() {
  const modal = document.querySelector('[data-modal="lifeMapLearning"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeMapLearning"]');
  if (!modal || !overlay) return;

  openModal(modal, overlay);
  startMapAnimation();
}

/**
 * 지도 심화학습 팝업 닫기
 */
function closeMapLearning() {
  const modal = document.querySelector('[data-modal="lifeMapLearning"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeMapLearning"]');
  if (!modal) return;

  closeModal(modal, overlay);
}

/**
 * 지도 확대 애니메이션 시작 (추후 구현)
 */
function startMapAnimation() {
  // TODO: 세계지도 → 동아시아 → 대한민국 → 러시아 연해주 → 블라디보스토크 순 확대 애니메이션 구현
  // TODO: 위치 핀, 이동 경로, 단계별 설명, Skip 버튼 연동
}

/**
 * 지도 심화학습 완료 후 하얼빈 의거 첫 콘텐츠로 이동
 */
function finishMapAnimation() {
  hasSeenMapLearningPopup = true;
  closeMapLearning();

  const harbinIndex = lifeContents.findIndex((content) => content.id === "harbin-plan");
  if (harbinIndex >= 0) {
    goToLifeContent(harbinIndex);
  }
}

/**
 * 역사 심화학습 팝업 초기화 — X 버튼 클릭 시 동양 평화 첫 콘텐츠로 이동
 */
function initHistoryLearningPopup() {
  const modal = document.querySelector('[data-modal="lifeHistoryLearning"]');
  if (!modal) return;

  modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      finishHistoryLearning();
    });
  });
}

/**
 * 역사 심화학습 팝업 열기
 */
function openHistoryLearning() {
  const modal = document.querySelector('[data-modal="lifeHistoryLearning"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeHistoryLearning"]');
  if (!modal || !overlay) return;

  openModal(modal, overlay);
}

/**
 * 역사 심화학습 팝업 닫기
 */
function closeHistoryLearning() {
  const modal = document.querySelector('[data-modal="lifeHistoryLearning"]');
  const overlay = document.querySelector('[data-modal-overlay="lifeHistoryLearning"]');
  if (!modal) return;

  closeModal(modal, overlay);
}

/**
 * 역사 심화학습 완료 후 동양 평화 첫 콘텐츠로 이동
 */
function finishHistoryLearning() {
  hasSeenHistoryLearningPopup = true;
  closeHistoryLearning();

  const peaceIndex = lifeContents.findIndex((content) => content.id === "peace-trial");
  if (peaceIndex >= 0) {
    goToLifeContent(peaceIndex);
  }
}

/**
 * 팝업 트리거 초기화
 */
function initLifePopupTriggers() {
  const lifeBody = document.getElementById("lifeBody");
  if (!lifeBody) return;

  lifeBody.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-popup]");
    if (!trigger) return;

    e.preventDefault();
    openLifePopup(trigger.dataset.popup);
  });
}

/**
 * 콘텐츠 인덱스로 이동
 * @param {number} index
 */
function goToLifeContent(index) {
  if (index < 0 || index >= lifeContents.length) return;

  stopNarrationHighlight();
  setSoundButtonState(false);
  currentLifeIndex = index;
  renderLifeContent(index);
  updateLifeNavButtons();
  updateLifeToc(index);
}

/**
 * 메인 콘텐츠 렌더링
 * @param {number} index
 */
function renderLifeContent(index) {
  const content = lifeContents[index];
  if (!content) return;

  const illustration = document.getElementById("lifeIllustration");
  const chapter = document.getElementById("lifeChapter");
  const heading = document.getElementById("lifeHeading");
  const body = document.getElementById("lifeBody");

  if (illustration) {
    illustration.src = content.image;
    illustration.alt = content.imageAlt;
  }

  if (chapter) chapter.textContent = content.chapter;
  if (heading) heading.textContent = content.heading;
  if (body) body.innerHTML = buildNarrationHtml(content.lines);

  document.title = content.pageTitle;
}

/**
 * 나레이션 본문 HTML 생성
 * @param {Array<{text: string, popupId?: string, popupLinks?: Array<{word: string, popupId: string}>}>} lines
 * @returns {string}
 */
function buildNarrationHtml(lines) {
  return lines
    .map((line) => {
      if (line.popupId) {
        return `<span class="narration-line"><button type="button" class="narration-link" data-popup="${line.popupId}">${line.text}</button></span>`;
      }

      const text = line.popupLinks ? applyPopupLinks(line.text, line.popupLinks) : line.text;

      return `<span class="narration-line">${text}</span>`;
    })
    .join("");
}

/**
 * 본문 내 특정 단어를 팝업 링크로 변환
 * @param {string} text
 * @param {Array<{word: string, popupId: string, linkClass?: string}>} links
 * @returns {string}
 */
function applyPopupLinks(text, links) {
  return links.reduce((result, link) => {
    const linkClass = link.linkClass || "narration-link--keyword";
    const button = `<button type="button" class="narration-link ${linkClass}" data-popup="${link.popupId}">${link.word}</button>`;
    return result.replace(link.word, button);
  }, text);
}

/**
 * 좌측 목차 active 상태 업데이트
 * @param {number} index
 */
function updateLifeToc(index) {
  const content = lifeContents[index];
  if (!content) return;

  document.querySelectorAll(".life__toc-section[data-toc-section]").forEach((section) => {
    const sectionNum = Number(section.dataset.tocSection);
    section.classList.toggle("is-active", sectionNum === content.tocSection);
  });

  document.querySelectorAll(".life__sidebar [data-life-index]").forEach((link) => {
    const linkIndex = Number(link.dataset.lifeIndex);
    const isHeadingLink = link.classList.contains("life__toc-heading-link");
    const isActive =
      !isHeadingLink &&
      content.tocIndex !== null &&
      content.tocIndex !== undefined &&
      linkIndex === content.tocIndex;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/**
 * 이전/다음 버튼 상태 업데이트
 */
function updateLifeNavButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.disabled = currentLifeIndex <= 0;
  if (nextBtn) nextBtn.disabled = false;
}

/**
 * 팝업 열기
 * @param {string} popupId
 */
function openLifePopup(popupId) {
  const popupData = lifePopups[popupId];
  if (!popupData) return;

  const modal = document.querySelector('[data-modal="lifePopup"]');
  const overlay = document.querySelector('[data-modal-overlay="lifePopup"]');
  const image = document.getElementById("lifePopupImage");
  const title = document.getElementById("lifePopupTitle");
  const desc = document.getElementById("lifePopupDesc");

  if (image) {
    image.src = popupData.image;
    image.alt = popupData.imageAlt;
  }

  if (title) title.textContent = popupData.title;
  if (desc) {
    const hasDescription = Boolean(popupData.description);
    desc.textContent = popupData.description || "";
    desc.hidden = !hasDescription;
  }

  openModal(modal, overlay);
}

/**
 * 사운드 버튼 토글 + 나레이션 하이라이트 연동
 */
function toggleSound() {
  const soundBtn = document.getElementById("soundBtn");
  if (!soundBtn) return;

  const isOn = soundBtn.getAttribute("aria-pressed") === "true";

  if (isOn) {
    stopNarrationHighlight();
    setSoundButtonState(false);
  } else {
    startNarrationHighlight();
  }
}

/**
 * 사운드 버튼 UI 상태 변경
 * @param {boolean} isOn
 */
function setSoundButtonState(isOn) {
  const soundBtn = document.getElementById("soundBtn");
  const soundIcon = soundBtn?.querySelector(".life__sound-icon");
  if (!soundBtn || !soundIcon) return;

  const soundOnSrc = soundIcon.dataset.soundOn;
  const soundOffSrc = soundIcon.dataset.soundOff;

  if (isOn) {
    soundIcon.src = soundOnSrc;
    soundBtn.setAttribute("aria-pressed", "true");
    soundBtn.setAttribute("aria-label", "사운드 켜짐");
  } else {
    soundIcon.src = soundOffSrc;
    soundBtn.setAttribute("aria-pressed", "false");
    soundBtn.setAttribute("aria-label", "사운드 꺼짐");
  }
}

/**
 * 나레이션 하이라이트 시작 (임시 타이머 방식)
 */
function startNarrationHighlight() {
  // TODO: 실제 오디오 파일 연동 시 audio.play() 및 timeupdate 이벤트로 하이라이트 동기화

  const lines = document.querySelectorAll("#lifeBody .narration-line");
  if (!lines.length) return;

  stopNarrationHighlight();
  setSoundButtonState(true);
  narrationIndex = 0;

  lines[narrationIndex].classList.add("is-active");

  narrationTimerId = window.setInterval(() => {
    lines[narrationIndex]?.classList.remove("is-active");
    narrationIndex += 1;

    if (narrationIndex >= lines.length) {
      stopNarrationHighlight();
      setSoundButtonState(false);
      return;
    }

    lines[narrationIndex].classList.add("is-active");
  }, NARRATION_INTERVAL_MS);
}

/**
 * 나레이션 하이라이트 정지
 */
function stopNarrationHighlight() {
  if (narrationTimerId !== null) {
    clearInterval(narrationTimerId);
    narrationTimerId = null;
  }

  resetNarrationHighlight();
}

/**
 * 나레이션 하이라이트 초기화
 */
function resetNarrationHighlight() {
  document.querySelectorAll("#lifeBody .narration-line.is-active").forEach((line) => {
    line.classList.remove("is-active");
  });

  narrationIndex = 0;
}
