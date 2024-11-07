let history = [];
let currentTagIndex = null;

function appendCharacter(character) {
    const display = document.getElementById('display');
    if (display.innerText === '0') {
        display.innerText = character;
    } else {
        display.innerText += character;
    }
    showRealTimeResult();
}

function showRealTimeResult() {
    const display = document.getElementById('display');
    const realTimeResult = document.getElementById('realTimeResult');
    const expression = display.innerText;

    if (/[+\-*/]/.test(expression) && /\d[+\-*/]\d/.test(expression) && !/[+\-*/]$/.test(expression)) {
        try {
            const result = eval(expression.replace('÷', '/').replace('×', '*'));
            realTimeResult.innerText = `= ${result}`;
        } catch (error) {
            realTimeResult.innerText = "= 0";
        }
    } else {
        realTimeResult.innerText = "= 0";
    }
}

function clearDisplay() {
    document.getElementById('display').innerText = '0';
    document.getElementById('realTimeResult').innerText = '= 0';
}

function backspace() {
    const display = document.getElementById('display');
    display.innerText = display.innerText.slice(0, -1) || '0';
    showRealTimeResult();
}

function calculateResult() {
    const display = document.getElementById('display');
    try {
        if (!/[+\-*/]$/.test(display.innerText)) {
            const result = eval(display.innerText.replace('÷', '/').replace('×', '*'));
            history.push({ expression: display.innerText, result: result, tag: '' });
            display.innerText = result;
            saveHistoryToJSON();
            updateHistoryPanel();
        }
    } catch (error) {
        display.innerText = 'Error';
    }
}

function saveHistoryToJSON() {
    const historyJSON = JSON.stringify(history, null, 2);
    localStorage.setItem('calcHistory', historyJSON);
}

function updateHistoryPanel() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach((entry, index) => {
        const row = `
            <tr>
                <td>${entry.expression} = ${entry.result}</td>
                <td>${entry.tag || ''}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="openTagModal(${index})">
                        <i class="fa fa-tag"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHistory(${index})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        historyList.insertAdjacentHTML('beforeend', row);
    });
}

function loadHistoryToDisplay(index) {
    const entry = history[index];
    document.getElementById('display').innerText = entry.expression;
    showRealTimeResult();
}

function deleteHistory(index) {
    history.splice(index, 1);
    saveHistoryToJSON();
    updateHistoryPanel();
}

function clearAllHistory() {
    history = [];
    saveHistoryToJSON();
    updateHistoryPanel();
}

function openTagModal(index) {
    currentTagIndex = index;
    document.getElementById('tagInput').value = history[index].tag || '';
    $('#tagModal').modal('show');
}

function saveTag() {
    const tag = document.getElementById('tagInput').value.trim();
    if (currentTagIndex !== null) {
        history[currentTagIndex].tag = tag;
        saveHistoryToJSON();
        updateHistoryPanel();
    }
    $('#tagModal').modal('hide');
}

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '+' || key === '-' || key === '*' || key === '/' || key === '.' || key === '(' || key === ')') {
        appendCharacter(key);
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
