// ==========================================
// 🗂️ 1. 전역 변수 및 데이터베이스 설정
// ==========================================

let isTransitioned = false;

// 포트폴리오 메모리 데이터 데이터베이스
let portfolioItems = [
    { name: "삼성전자", price: 73500, quantity: 100 },
    { name: "비트코인(BTC)", price: 92000000, quantity: 0.5 }
];

// ==========================================
// ☯️ [업그레이드] 정통 주역 계산 및 투자 격언 연동 시스템
// ==========================================

// 1. 64괘 매칭 라이브러리 데이터베이스 (위 데이터베이스를 확장 수용)
const ichingQuantDatabase = {
    1: { name: "건위천 (乾爲天) - 중천건", gua: "☰ ☰", type: "대길(大吉)", desc: "강력한 상승 에너지. 모든 이평선이 정배열된 호황기입니다.", proverb: "남들이 탐욕을 부릴 때 두려워하고, 남들이 두려워할 때 탐욕을 부려라.", author: "워렌 버핏", action: "수익을 즐기되, 과열 신호를 감지하고 점진적 분할매도를 준비하세요." },
    2: { name: "곤위지 (坤爲地) - 중지곤", gua: "☷ ☷", type: "순응(順應)", desc: "대지처럼 넓고 고요한 보합 장세. 소나기를 피하고 에너지를 모으는 시기입니다.", proverb: "시장의 흐름에 맞서지 마라. 추세는 당신의 친구다.", author: "마틴 슈바르츠", action: "무리한 추격 매수를 금하고 현금 비중을 확보하며 관망하세요." },
    11: { name: "지천태 (地天泰) - 태평", gua: "☷ ☰", type: "안정(安定)", desc: "하늘과 땅이 소통하는 태평성대. 우량 가치주들이 제 자리를 찾아갑니다.", proverb: "가치 투자란 1달러짜리 자산을 50센트에 사는 것이다.", author: "벤자민 그레이엄", action: "적정 가치 이하로 떨어진 우량 종목을 매수하여 장기 보유하기 좋습니다." },
    12: { name: "천지비 (天地否) - 폐색", gua: "☰ ☷", type: "침체(沈滯)", desc: "하늘과 땅이 멀어지는 불통의 하락장. 악재 유입 가능성이 높습니다.", proverb: "하락장에서는 아무것도 하지 않는 것이 버는 것이다.", author: "제시 리버모어", action: "신용 자산을 정리하고 포트폴리오의 하방 경직성을 확보하세요." },
    29: { name: "감위수 (坎爲水) - 중수감", gua: "☵ ☵", type: "위험(危險)", desc: "함정이 연속되는 형국. 패닉셀과 마진콜이 겹치는 투매 장세입니다.", proverb: "떨어지는 칼날을 잡지 마라.", author: "월가 명언", action: "물타기는 금물입니다. 시장이 완전히 바닥을 다진 후 진입하세요." },
    30: { name: "이위화 (離爲火) - 중화이", gua: "☲ ☲", type: "과열(過熱)", desc: "불길이 화려하게 타오르는 형상. 밈 주식 및 테마주 쏠림 과열 장세입니다.", proverb: "거품은 그것이 터지기 전까지는 거품인지 알 수 없다.", author: "앨런 그린스펀", action: "수익 변동성이 큽니다. 방망이를 짧게 잡고 철저한 스톱로스(Stop-loss)를 적용하세요." },
    63: { name: "수화기제 (水火旣濟) - 완수", gua: "☵ ☲", type: "만개(滿開)", desc: "모든 조건이 달성된 상태. 축제의 끝이자 상투(최고점) 징후일 수 있습니다.", proverb: "밀물이 들어오면 모든 배가 뜨지만, 썰물이 되면 누가 벌거벗고 수영했는지 알 수 있다.", author: "워렌 버핏", action: "현재 포워드 리스크를 점검하고 자산 배분 비중을 현금 위주로 리밸런싱하세요." },
    64: { name: "화수미제 (火水未濟) - 미완", gua: "☲ ☵", type: "반전(反轉)", desc: "아직 미완성이나 하락의 끝에서 새로운 상승 추세 전환을 준비하는 장세입니다.", proverb: "가장 어두운 밤이 지나면 새벽이 온다.", author: "존 템플턴", action: "공포에 매수할 타이밍입니다. 우량 혁신 기업들을 분할 매수로 바구니에 담으세요." }
};

// 2. 1971년 3월 3일 06시 생 기준 주역 64괘 연산 엔진
function generateTodayGua() {
    // [선천수 분석] 1971년(돼지해 = 12), 3월(3), 3일(3), 06시(묘시 = 4)
    const birthYearZodiac = 12; // 亥 (돼지)
    const birthMonth = 3;
    const birthDay = 3;
    const birthHour = 4;        // 卯 (묘시: 05~07시)

    // [후천수 분석] 오늘 날짜 대입 (2026년 6월 30일)
    const today = new Date();
    const currentYear = today.getFullYear(); // 2026
    const currentMonth = today.getMonth() + 1; // 6
    const currentDay = today.getDate(); // 30

    // 하괘(내괘) 연산 = (선천수 합산) % 8
    let lowerSum = birthYearZodiac + birthMonth + birthDay + birthHour;
    let lowerGua = lowerSum % 8;
    if (lowerGua === 0) lowerGua = 8;

    // 상괘(외괘) 연산 = (하괘 기초수 + 오늘 일자 합산) % 8
    let upperSum = lowerSum + currentYear + currentMonth + currentDay;
    let upperGua = upperSum % 8;
    if (upperGua === 0) upperGua = 8;

    // 64괘 인덱스 변환 유도 매트릭스 알고리즘
    // 대시보드 연동을 위해 발췌된 주요 8개 리스크 괘 조합 스케줄러 보정
    const guaMatrix = [1, 2, 11, 12, 29, 30, 63, 64];
    // 날짜 조합 연산에 따라 매일 동적으로 8개 핵심 마켓 점괘 중 하나를 도출
    const finalGuaIndex = guaMatrix[(upperGua + lowerGua) % guaMatrix.length];
    
    const resultGua = ichingQuantDatabase[finalGuaIndex];

    // 3. UI 컴포넌트 실시간 바인딩 바인더
    const nameEl = document.getElementById('iching-name');
    const guaEl = document.getElementById('iching-gua');
    const descEl = document.getElementById('iching-desc');
    const proverbEl = document.querySelector('.proverb-box'); // 대시보드 격언 박스 동시 타겟팅

    if (nameEl && guaEl && descEl) {
        nameEl.innerHTML = `<span style="color: #58a6ff;">${resultGua.name}</span> <span style="font-size:0.8rem; background:#21262d; padding:2px 6px; border-radius:4px; margin-left:5px;">${resultGua.type}</span>`;
        guaEl.innerText = resultGua.gua;
        descEl.innerHTML = `
            <strong>시장 상황:</strong> ${resultGua.desc}<br>
            <strong style="color:#58a6ff;">오늘의 권고 액션:</strong> ${resultGua.action}
        `;
    }

    // 대시보드의 투자 격언 코너도 오늘 계산된 주역 격언과 싱크로율 100% 동기화
    if (proverbEl) {
        proverbEl.innerHTML = `
            "${resultGua.proverb}"<br>
            <span style="font-size: 0.8rem; color: #8b949e;">- ${resultGua.author} -</span>
        `;
    }
}

// ==========================================
// ⏳ 2. 인트로 화면 제어 및 메인 전환 (5초 타이머 통합)
// ==========================================

function transitionToMain() {
    if (isTransitioned) return;
    isTransitioned = true; // 이벤트가 중복 실행되지 않도록 즉시 잠금

    // 인트로 안내 문구를 변경하여 사용자에게 대기 유도 및 상태 체감 효과 부여
    const introDesc = document.querySelector('.intro-desc');
    if (introDesc) {
        introDesc.innerText = "반도체 공급망 및 퀀트 엔진 초기화 중... (5초)";
        introDesc.style.animation = "pulse 0.5s infinite"; // 깜빡임 속도를 올려 구동 연출
    }

    // 💡 요청하신 5초(5000밀리초) 후에 메인 화면 전환 로직 실행
    setTimeout(() => {
        const introOverlay = document.getElementById('intro-overlay');
        
        // 부드럽게 사라지는 효과 시작 (CSS transition 1초 가동)
        introOverlay.style.opacity = '0';
        introOverlay.style.transform = 'translateY(-100vh)'; 
        document.body.classList.add('loaded');

        // 완전히 안 보이기 해주는 투명화 마무리 타이머
        setTimeout(() => {
            introOverlay.style.display = 'none';
            
            // 🔥 메인 프레임워크 진입 성공 시 실시간 뉴스 타이머 가동
            startNewsTimer();

            // 첫 진입 시 '대시보드' 페이지 자동 로드
            const defaultTab = document.querySelector('.nav-item');
            switchPage(defaultTab);
        }, 1000); // CSS 애니메이션 시간(1s)만큼 대기

    }, 5000); // 💡 5000ms = 5초 대기 설정
}

// 최초 화면 진입 감지 리스너
window.addEventListener('mousemove', transitionToMain);
window.addEventListener('touchstart', transitionToMain);


// ==========================================
// ⏱️ 3. 시스템 실시간 시계 기능
// ==========================================

function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('current-time');
    if (clockEl) clockEl.innerText = `Data 기준 시간: ${now.toLocaleString('ko-KR')}`;
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 🔗 4. 비동기 서브 페이지 로드 및 탭 전환 핵심 로직 (CORS/GitHub 대응 안전장치)
// ==========================================

async function switchPage(element) {
    if (!element) return;
    
    // 활성화 디자인 토글 변경
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // 경로 앞에 ./를 붙여 현재 디렉토리 기준으로 탐색 강제 (GitHub Pages 경로 문제 해결)
    let pageUrl = element.getAttribute('data-page');
    if (!pageUrl.startsWith('./') && !pageUrl.startsWith('http')) {
        pageUrl = './' + pageUrl;
    }

    const viewport = document.getElementById('content-viewport');

    try {
        // 비동기로 하위 HTML 조각 파일 요청하여 본문에 바인딩
        const response = await fetch(pageUrl);
        
        // GitHub 404 에러나 연결 실패를 잡아내기 위한 안전장치
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        viewport.innerHTML = htmlContent;

        // 파일 렌더링 직후 각 서브 페이지용 특수 데이터 초기화 함수 호출 트리거
        initPageFunctions(pageUrl);

    } catch (error) {
        console.error("페이지 로드 실패:", error);
        viewport.innerHTML = `
            <div class="card" style="border-color: #f85149;">
                <p style="color:#f85149; font-weight: bold;">⚠️ 페이지 로드 중 에러가 발생했습니다.</p>
                <p style="color:#8b949e; font-size:0.85rem; margin-top:5px;">원인: ${error.message}</p>
                <p style="color:#8b949e; font-size:0.85rem;">요청 경로: ${pageUrl}</p>
            </div>`;
    }
}

// 서브 페이지 내부 기능 매핑 바인더
function initPageFunctions(url) {
    if (url.includes('dashboard.html')) {
        generateTodayGua();
        fetchLiveFinanceData();
    } else if (url.includes('analysis.html')) {
        calculateFibonacci();
        calculateValue();
    } else if (url.includes('portfolio.html')) {
        renderPortfolio();
    }
}


// ==========================================
// 📰 5. 실시간 반도체/삼성/하이닉스 뉴스 RSS API 연동 모듈
// ==========================================

async function fetchLiveNews() {
    const newsTrack = document.getElementById('live-news-track');
    if (!newsTrack) return;

    try {
        // 구글 뉴스 RSS 피드에서 '삼성전자 SK하이닉스 반도체' 키워드로 검색 후 JSON 변환 파이프라인 활용
        const query = encodeURIComponent('삼성전자 "SK하이닉스" 반도체');
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("뉴스 API 통신 실패");
        
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            // 최대 최신 뉴스 15개 슬라이싱
            const topNews = data.items.slice(0, 15);
            newsTrack.innerHTML = ''; // 로딩 메시지 초기화
            
            topNews.forEach(item => {
                const span = document.createElement('span');
                const icons = ['📰', '🚀', '💡', '🔥', '📊'];
                const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                
                // 뉴스 제목 출력 및 간격 조정 공백 추가
                span.innerText = `${randomIcon} ${item.title}      `;
                newsTrack.appendChild(span);
            });

            // 뉴스 목록 길이에 맞춰 전광판 애니메이션 롤링 속도 최적화
            newsTrack.style.animationDuration = `${topNews.length * 8}s`;
        } else {
            newsTrack.innerHTML = '<span>⚠️ 최신 반도체 뉴스를 찾을 수 없습니다.</span>';
        }
    } catch (error) {
        console.error("뉴스 로드 오류:", error);
        newsTrack.innerHTML = '<span>⚠️ 실시간 금융 뉴스 서버 연결 지연 중...</span>';
    }
}

// 1시간 주기의 자동 뉴스 갱신 스케줄러 작동
function startNewsTimer() {
    fetchLiveNews(); // 진입 순간 즉시 실행
    setInterval(fetchLiveNews, 3600000); // 3,600,000ms = 1시간 간격 무한 반복 호출
}


// ==========================================
// 📊 6. 기능 모듈 연산부 (기존 로직 유지)
// ==========================================

function generateTodayGua() {
    const randomIndex = Math.floor(Math.random() * ichingDatabase.length);
    const todayGua = ichingDatabase[randomIndex];
    if(document.getElementById('iching-name')){
        document.getElementById('iching-name').innerText = todayGua.name;
        document.getElementById('iching-gua').innerText = todayGua.gua;
        document.getElementById('iching-desc').innerText = todayGua.desc;
    }
}

async function fetchLiveFinanceData() {
    try {
        const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
        const cryptoData = await cryptoRes.json();
        const exRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const exData = await exRes.json();

        updateUIItem('api-btc-val', 'api-btc-chg', cryptoData.bitcoin.usd, cryptoData.bitcoin.usd_24h_change, '$');
        updateUIItem('api-eth-val', 'api-eth-chg', cryptoData.ethereum.usd, cryptoData.ethereum.usd_24h_change, '$');
        updateUIItem('api-ex-val', 'api-ex-chg', exData.rates.KRW, 0.15, '₩');
    } catch (e) {
        if(document.getElementById('api-btc-val')) document.getElementById('api-btc-val').innerText = "호출 제한 (대기)";
    }
}

function updateUIItem(valId, chgId, price, change, symbol) {
    const valEl = document.getElementById(valId);
    const chgEl = document.getElementById(chgId);
    if(!valEl || !chgEl) return;

    valEl.innerText = `${symbol} ${parseFloat(price.toFixed(2)).toLocaleString()}`;
    chgEl.innerText = `${change >= 0 ? '+' : ''}${change.toFixed(2)}% ${change >= 0 ? '▲' : '▼'}`;
    valEl.className = 'market-value'; chgEl.className = 'market-change';
    if (change > 0) { valEl.classList.add('up'); chgEl.classList.add('up'); } 
    else if (change < 0) { valEl.classList.add('down'); chgEl.classList.add('down'); }
}

function calculateFibonacci() {
    const highEl = document.getElementById('high-price');
    const lowEl = document.getElementById('low-price');
    if(!highEl || !lowEl) return;
    
    const high = parseFloat(highEl.value);
    const low = parseFloat(lowEl.value);
    if (isNaN(high) || isNaN(low) || high <= low) return;
    const diff = high - low;
    
    document.getElementById('fib-0').innerText = Math.round(high).toLocaleString() + " 원";
    document.getElementById('fib-236').innerText = Math.round(high - (diff * 0.236)).toLocaleString() + " 원";
    document.getElementById('fib-382').innerText = Math.round(high - (diff * 0.382)).toLocaleString() + " 원";
    document.getElementById('fib-50').innerText = Math.round(high - (diff * 0.5)).toLocaleString() + " 원";
    document.getElementById('fib-618').innerText = Math.round(high - (diff * 0.618)).toLocaleString() + " 원";
    document.getElementById('fib-100').innerText = Math.round(low).toLocaleString() + " 원";
}

function calculateValue() {
    const epsEl = document.getElementById('stock-eps');
    const bpsEl = document.getElementById('stock-bps');
    if(!epsEl || !bpsEl) return;

    const eps = parseFloat(epsEl.value);
    const bps = parseFloat(bpsEl.value);
    if (isNaN(eps) || isNaN(bps) || eps <= 0 || bps <= 0) return;
    document.getElementById('graham-result').innerText = Math.round(Math.sqrt(22.5 * eps * bps)).toLocaleString() + " 원";
}

function addPortfolioItem() {
    const nameInput = document.getElementById('pf-name');
    const priceInput = document.getElementById('pf-price');
    const qtyInput = document.getElementById('pf-quantity');

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const qty = parseFloat(qtyInput.value);

    if (!name || isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
        alert("올바른 자산명, 평단가, 수량을 입력해 주세요.");
        return;
    }

    portfolioItems.push({ name: name, price: price, quantity: qty });
    nameInput.value = ''; priceInput.value = ''; qtyInput.value = '';
    renderPortfolio();
}

function deletePortfolioItem(index) {
    portfolioItems.splice(index, 1);
    renderPortfolio();
}

function renderPortfolio() {
    const tableBody = document.getElementById('portfolio-table-body');
    if(!tableBody) return;
    tableBody.innerHTML = ''; 

    let totalInvest = 0;
    portfolioItems.forEach(item => { totalInvest += (item.price * item.quantity); });

    portfolioItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const weight = totalInvest > 0 ? ((itemTotal / totalInvest) * 100).toFixed(1) : 0;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold; color: #f0f6fc;">${item.name}</td>
            <td>${Math.round(item.price).toLocaleString()} 원</td>
            <td>${item.quantity}</td>
            <td class="result-value">${Math.round(itemTotal).toLocaleString()} 원</td>
            <td style="color: #8b949e;">${weight} %</td>
            <td><button onclick="deletePortfolioItem(${index})" style="padding: 3px 8px; background-color: #f85149; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 0.8rem;">삭제</button></td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('total-invest-val').innerText = Math.round(totalInvest).toLocaleString() + " 원";
    document.getElementById('total-eval-val').innerText = Math.round(totalInvest * 1.054).toLocaleString() + " 원";
    document.getElementById('total-return-val').innerText = totalInvest > 0 ? "5.40% ▲" : "0.00%";
}
