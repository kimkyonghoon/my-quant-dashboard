let isTransitioned = false;

// 포트폴리오 메모리 데이터 데이터베이스
let portfolioItems = [
    { name: "삼성전자", price: 73500, quantity: 100 },
    { name: "비트코인(BTC)", price: 92000000, quantity: 0.5 }
];

// 주역 데이터베이스
const ichingDatabase = [
    { name: "제1괘: 건위천 (乾爲天) - 대길", gua: "☰ ☰", desc: "용이 하늘을 나는 강력한 상승의 형국입니다. 시장의 에너지가 매수세로 가득 차 있습니다. 탐욕을 버리고 익절 구간을 고민할 때입니다." },
    { name: "제2괘: 곤위지 (坤爲地) - 순응", gua: "☷ ☷", desc: "넓은 대지처럼 유순한 장세입니다. 억지로 추격 매수하기보다는 시장의 흐름에 순응하며 현금을 확보하고 관망하는 것이 유리합니다." },
    { name: "제29괘: 감위수 (坎爲水) - 험난", gua: "☵ ☵", desc: "물속에 또 물이 빠진 격으로 함정이 도사리고 있습니다. 악재가 겹칠 수 있으니 리스크 관리에 만전을 기하고 소나기는 피해 가야 합니다." },
    { name: "제30괘: 이위화 (離爲火) - 화려", gua: "☲ ☲", desc: "불길이 타오르듯 화려한 장세입니다. 기술주나 급등 테마주가 주도할 가능성이 크며, 빠른 손절 기준을 잡고 단기 진입하기 좋습니다." }
];

// 1. 인트로 화면 제어 및 첫 대시보드 로드
function transitionToMain() {
    if (isTransitioned) return;
    isTransitioned = true;

    const introOverlay = document.getElementById('intro-overlay');
    introOverlay.style.opacity = '0';
    introOverlay.style.transform = 'translateY(-100vh)'; 
    document.body.classList.add('loaded');

    setTimeout(() => {
        introOverlay.style.display = 'none';
        // 첫 진입 시 '대시보드' 페이지 자동 로드
        const defaultTab = document.querySelector('.nav-item');
        switchPage(defaultTab);
    }, 1000);
}

window.addEventListener('mousemove', transitionToMain);
window.addEventListener('touchstart', transitionToMain);

// 2. 실시간 시계 기능
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('current-time');
    if (clockEl) clockEl.innerText = `Data 기준 시간: ${now.toLocaleString('ko-KR')}`;
}
setInterval(updateClock, 1000);
updateClock();

// 3. 💡 비동기 파일 로드 및 탭 전환 핵심 로직 (AJAX Fetch 기법)
async function switchPage(element) {
    if (!element) return;
    
    // 활성화 디자인 토글 변경
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const pageUrl = element.getAttribute('data-page');
    const viewport = document.getElementById('content-viewport');

    try {
        // 비동기로 하위 HTML 조각 파일 요청하여 본문에 바인딩
        const response = await fetch(pageUrl);
        const htmlContent = await response.json ? await response.json() : await response.text();
        viewport.innerHTML = htmlContent;

        // 파일 렌더링 직후 각 서브 페이지용 특수 데이터 초기화 함수 호출 트리거
        initPageFunctions(pageUrl);

    } catch (error) {
        console.error("페이지 로드 실패:", error);
        viewport.innerHTML = `<div class="card"><p style="color:#f85149;">페이지 로드 중 에러가 발생했습니다.</p></div>`;
    }
}

// 4. 서브 페이지 전용 내부 연동 함수 바인더
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
// 5. 기능 모듈 (기존 기능 100% 동일 보존)
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