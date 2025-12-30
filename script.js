// DOM Elements
const charInput = document.getElementById('charInput');
const clearBtn = document.getElementById('clearBtn');
const asciiResult = document.getElementById('asciiResult');
const unicodeResult = document.getElementById('unicodeResult');
const asciiDetails = document.getElementById('asciiDetails');
const unicodeDetails = document.getElementById('unicodeDetails');
const charInfoSection = document.getElementById('charInfoSection');
const charDisplay = document.getElementById('charDisplay');
const charType = document.getElementById('charType');
const charBytes = document.getElementById('charBytes');
const infoModal = document.getElementById('infoModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const exampleBtns = document.querySelectorAll('.example-btn');
const infoBadges = document.querySelectorAll('.info-badge');

// Event Listeners
charInput.addEventListener('input', handleInput);
clearBtn.addEventListener('click', clearInput);
modalClose.addEventListener('click', closeModal);
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) closeModal();
});

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const char = btn.getAttribute('data-char');
        charInput.value = char;
        handleInput();
    });
});

infoBadges.forEach(badge => {
    badge.addEventListener('click', () => {
        const infoType = badge.getAttribute('data-info');
        showInfoModal(infoType);
    });
});

// Main Input Handler
function handleInput() {
    const char = charInput.value;

    if (char.length > 0) {
        clearBtn.classList.add('visible');
        const firstChar = char[0];
        charInput.value = firstChar;
        displayResults(firstChar);
    } else {
        clearBtn.classList.remove('visible');
        clearResults();
    }
}

// Display Results
function displayResults(char) {
    // Show character info section
    charInfoSection.style.display = 'block';

    // Display character
    charDisplay.textContent = char;

    // Get character info
    const codePoint = char.codePointAt(0);
    const isAscii = codePoint <= 127;
    const type = getCharacterType(char, codePoint);
    const bytes = getByteSize(char);

    // Update character info
    charType.textContent = type;
    charBytes.textContent = bytes;

    // Display ASCII
    displayAscii(char, codePoint, isAscii);

    // Display Unicode
    displayUnicode(char, codePoint);
}

// Display ASCII Results
function displayAscii(char, codePoint, isAscii) {
    if (isAscii) {
        asciiResult.innerHTML = `
            <div class="result-value">${codePoint}</div>
        `;

        asciiDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-label" data-tooltip="우리가 일상적으로 사용하는 0, 1, 2, 3... 형태의 숫자 체계입니다. 컴퓨터가 사람에게 보여주는 가장 친숙한 형태입니다.">10진수</span>
                <span class="detail-value">${codePoint}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label" data-tooltip="0~9와 A~F를 사용하는 16개 기호로 표현하는 숫자 체계입니다. 컴퓨터에서 메모리 주소나 색상 코드를 표현할 때 자주 사용됩니다. (예: #FF0000 = 빨간색)">16진수</span>
                <span class="detail-value">0x${codePoint.toString(16).toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label" data-tooltip="0~7까지 8개의 숫자만 사용하는 숫자 체계입니다. 과거 컴퓨터 시스템에서 권한 설정 등에 사용되었습니다.">8진수</span>
                <span class="detail-value">0${codePoint.toString(8)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label" data-tooltip="0과 1만 사용하는 숫자 체계입니다. 컴퓨터가 내부적으로 모든 데이터를 저장하고 처리하는 기본 형태입니다. 각 자리는 '비트(bit)'라고 부릅니다.">2진수</span>
                <span class="detail-value">${codePoint.toString(2).padStart(8, '0')}</span>
            </div>
        `;
        asciiDetails.classList.add('visible');
    } else {
        asciiResult.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">⚠️</span>
                <p>ASCII 범위를 벗어난<br>문자입니다<br><small style="color: var(--text-muted);">(ASCII는 0~127만 지원)</small></p>
            </div>
        `;
        asciiDetails.classList.remove('visible');
    }
}

// Display Unicode Results
function displayUnicode(char, codePoint) {
    unicodeResult.innerHTML = `
        <div class="result-value">U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}</div>
    `;

    const utf8Bytes = getUTF8Bytes(char);
    const utf16Bytes = getUTF16Bytes(char);

    unicodeDetails.innerHTML = `
        <div class="detail-item">
            <span class="detail-label" data-tooltip="유니코드에서 각 문자에 부여된 고유한 번호입니다. 10진수로 표현한 값으로, 전 세계 모든 문자마다 하나씩 할당되어 있습니다.">코드 포인트 (10진수)</span>
            <span class="detail-value">${codePoint}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label" data-tooltip="코드 포인트를 16진수로 표현한 값입니다. 유니코드 표준에서는 'U+'를 앞에 붙여 16진수로 표기합니다. (예: U+AC00 = '가')">코드 포인트 (16진수)</span>
            <span class="detail-value">U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label" data-tooltip="UTF-8은 유니코드를 실제로 저장하는 방식입니다. 영문은 1바이트, 한글은 3바이트로 저장되어 효율적입니다. 웹에서 가장 많이 사용하는 인코딩 방식입니다.">UTF-8 인코딩</span>
            <span class="detail-value">${utf8Bytes}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label" data-tooltip="UTF-16은 대부분의 문자를 2바이트로 저장하는 방식입니다. Windows와 Java에서 내부적으로 사용합니다. 이모지 같은 특수 문자는 4바이트를 사용합니다.">UTF-16 인코딩</span>
            <span class="detail-value">${utf16Bytes}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label" data-tooltip="HTML 문서에서 특수 문자를 표현하는 방법입니다. &#숫자; 형태로 작성하면 브라우저가 해당 유니코드 문자로 표시합니다. (예: &#45208; = '나')">HTML 엔티티</span>
            <span class="detail-value">&amp;#${codePoint};</span>
        </div>
    `;
    unicodeDetails.classList.add('visible');
}

// Get Character Type
function getCharacterType(char, codePoint) {
    if (codePoint >= 0x1F300 && codePoint <= 0x1F9FF) {
        return '이모지 (Emoji)';
    } else if (codePoint >= 0xAC00 && codePoint <= 0xD7A3) {
        return '한글 (Korean)';
    } else if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) {
        return '한자 (Chinese)';
    } else if (codePoint >= 0x3040 && codePoint <= 0x309F) {
        return '히라가나 (Japanese)';
    } else if (codePoint >= 0x30A0 && codePoint <= 0x30FF) {
        return '가타카나 (Japanese)';
    } else if ((codePoint >= 0x41 && codePoint <= 0x5A) || (codePoint >= 0x61 && codePoint <= 0x7A)) {
        return '영문자 (Alphabet)';
    } else if (codePoint >= 0x30 && codePoint <= 0x39) {
        return '숫자 (Number)';
    } else if (codePoint <= 127) {
        return 'ASCII 특수문자';
    } else {
        return '기타 유니코드 문자';
    }
}

// Get Byte Size
function getByteSize(char) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(char).length;
    return `${bytes} 바이트`;
}

// Get UTF-8 Bytes
function getUTF8Bytes(char) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(char);
    return Array.from(bytes)
        .map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');
}

// Get UTF-16 Bytes
function getUTF16Bytes(char) {
    const bytes = [];
    for (let i = 0; i < char.length; i++) {
        const code = char.charCodeAt(i);
        bytes.push('0x' + code.toString(16).toUpperCase().padStart(4, '0'));
    }
    return bytes.join(' ');
}

// Clear Input
function clearInput() {
    charInput.value = '';
    clearBtn.classList.remove('visible');
    clearResults();
    charInput.focus();
}

// Clear Results
function clearResults() {
    asciiResult.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">💭</span>
            <p>문자를 입력하면<br>ASCII 코드가 표시됩니다</p>
        </div>
    `;

    unicodeResult.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">💭</span>
            <p>문자를 입력하면<br>유니코드가 표시됩니다</p>
        </div>
    `;

    asciiDetails.classList.remove('visible');
    unicodeDetails.classList.remove('visible');
    charInfoSection.style.display = 'none';
}

// Show Info Modal
function showInfoModal(type) {
    let content = '';

    if (type === 'ascii') {
        content = `
            <h3>📊 ASCII 코드란?</h3>
            <p><strong>ASCII</strong>는 American Standard Code for Information Interchange의 약자입니다.</p>
            <p>1960년대에 만들어진 문자 인코딩 방식으로, 컴퓨터가 문자를 숫자로 표현하기 위해 사용됩니다.</p>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">주요 특징</h4>
            <ul style="color: var(--text-secondary); line-height: 1.8;">
                <li>총 128개의 문자를 표현 (0~127)</li>
                <li>7비트로 표현 (실제로는 8비트 사용)</li>
                <li>영문 대소문자, 숫자, 특수문자, 제어문자 포함</li>
                <li>한글, 한자 등은 표현 불가능</li>
            </ul>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">주요 범위</h4>
            <ul style="color: var(--text-secondary); line-height: 1.8;">
                <li>0~31: 제어 문자 (화면에 표시되지 않음)</li>
                <li>32: 공백 (Space)</li>
                <li>48~57: 숫자 0~9</li>
                <li>65~90: 대문자 A~Z</li>
                <li>97~122: 소문자 a~z</li>
            </ul>
        `;
    } else if (type === 'unicode') {
        content = `
            <h3>🌍 유니코드란?</h3>
            <p><strong>유니코드</strong>는 전 세계의 모든 문자를 컴퓨터에서 일관되게 표현하고 다룰 수 있도록 만든 국제 표준입니다.</p>
            <p>ASCII의 한계를 극복하기 위해 1991년에 처음 발표되었습니다.</p>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">주요 특징</h4>
            <ul style="color: var(--text-secondary); line-height: 1.8;">
                <li>전 세계 모든 언어의 문자 표현 가능</li>
                <li>이모지, 기호, 고대 문자까지 포함</li>
                <li>현재 약 15만 개 이상의 문자 정의</li>
                <li>U+0000부터 U+10FFFF까지 표현</li>
            </ul>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">인코딩 방식</h4>
            <ul style="color: var(--text-secondary); line-height: 1.8;">
                <li><strong>UTF-8</strong>: 1~4바이트 가변 길이 (웹에서 가장 많이 사용)</li>
                <li><strong>UTF-16</strong>: 2바이트 또는 4바이트</li>
                <li><strong>UTF-32</strong>: 항상 4바이트 고정</li>
            </ul>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">주요 범위</h4>
            <ul style="color: var(--text-secondary); line-height: 1.8;">
                <li>U+0000~U+007F: ASCII와 동일</li>
                <li>U+AC00~U+D7A3: 한글</li>
                <li>U+4E00~U+9FFF: 한자</li>
                <li>U+1F300~U+1F9FF: 이모지</li>
            </ul>
        `;
    }

    modalBody.innerHTML = content;
    infoModal.classList.add('visible');
}

// Close Modal
function closeModal() {
    infoModal.classList.remove('visible');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (infoModal.classList.contains('visible')) {
            closeModal();
        } else if (charInput.value) {
            clearInput();
        }
    }
});

// Auto-focus input on load
window.addEventListener('load', () => {
    charInput.focus();
});
