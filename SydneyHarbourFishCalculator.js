// Data Structure
let totalPercentageUsed = 0;
let logs = [];
 
const LANG_STORAGE_KEY = 'sydneyFishCalculatorLang';
const LOCAL_STORAGE_KEY = 'sydneyFishCalculatorLogs';

// DOM Elements Cache
const domElements = {
    gaugeChartCanvas: null,
    percentageDisplay: null,
    statusText: null,
    remainingText: null,
    progressBar: null,
    fishSelect: null,
    weightInput: null,
    logSection: null,
    logList: null,
    forecastGrid: null,
    sortDateBtn: null,
    sortPercentBtn: null,
    editModal: null,
    editFishSelect: null,
    editWeightInput: null,
    saveEditBtn: null,
    sortForecastRiskBtn: null,
    sortForecastGramsBtn: null,
    langToggleBtn: null
};
 
let gaugeChart;
let currentLang = 'zh';
let currentForecastSort = 'risk'; // 'risk' or 'grams'
const riskOrder = { 'extreme': 0, 'high': 1, 'med': 2, 'low': 3 };


const translations = {
    en: {
        appDescription: 'This tool is designed to help you manage your dioxin intake from consuming seafood from Sydney Harbour (east of the Harbour Bridge). All recommendations are based on official guidelines from the NSW Food Authority.',
        appTitle: 'Dioxin Calculator',
        dataSourceLink: '<i class="fas fa-link mr-1"></i>Click to view data source',
        westWarning: 'WARNING: Any fish and crustaceans caught west of the Harbour Bridge should not be eaten.',
        pregnantWarning: 'WARNING: Pregnant women, women planning pregnancy, and young children should NOT eat any seafood caught in Sydney Harbour (east of the Harbour Bridge).',
        tankTitle: 'Monthly Dioxin Quota (Tank Level)',
        remaining: 'Remaining',
        inputTitle: 'What did you eat today?',
        selectFish: 'Select Seafood',
        weightLabel: 'Weight (g)',
        serving1: '1 Serve (150g)',
        serving2: '2 Serves (300g)',
        addEntry: '<i class="fas fa-plus-circle mr-2"></i> Add to Log',
        logTitle: 'Logged Intake',
        resetAll: 'Reset All',
        sortBy: 'Sort by:',
        sortTime: 'Time',
        sortPercent: 'Percentage',
        forecastTitle: 'What can you still eat?',
        forecastSubtitle: 'Calculated based on the current remaining percentage',
        sortRisk: 'Risk',
        sortGrams: 'Grams',
        editTitle: 'Edit Entry',
        fishLabel: 'Seafood',
        cancel: 'Cancel',
        save: 'Save Changes',
        consumption: 'Intake',
        limit: 'Limit',
        edit: 'Edit',
        delete: 'Delete',
        confirmClear: 'Are you sure you want to clear all records and reset the tank?',
        weightPlaceholder: 'e.g., 150',
        enterValidWeight: 'Please enter a valid weight',
        statusSafe: 'Safe',
        statusWarning: 'Warning',
        statusDanger: 'Danger',
        statusOverload: 'Overload!',
        categoryLabels: {
            'high-cost': '⚠️ High Consumption (150g per month)',
            'medium-cost': '⚠️ Medium Consumption (600-750g per month)',
            'low-cost': '✅ Low Consumption (1200g+ per month)',
            'extreme-cost': '⛔ Extreme (50g per 3 months)'
        }
    },
    zh: {
        appDescription: '本工具旨在帮助您管理因食用悉尼港海鲜（海港大桥以东）而产生的二恶英摄入量。所有建议均基于 NSW Food Authority 官方指南。',
        appTitle: '二恶英计算器',
        dataSourceLink: '<i class="fas fa-link mr-1"></i>点击查看数据来源',
        westWarning: '警告：海港大桥以西捕获的任何鱼类和甲壳类动物均不应食用。',
        pregnantWarning: '警告：孕妇、计划怀孕的女性以及幼儿不应食用任何在悉尼港（海港大桥以东）捕获的海鲜。',
        tankTitle: '本月二恶英额度 (Tank Level)',
        remaining: '剩余额度',
        inputTitle: '今天吃了什么？',
        selectFish: '选择鱼类',
        weightLabel: '食入重量 (克/g)',
        serving1: '1份(150g)',
        serving2: '2份(300g)',
        addEntry: '<i class="fas fa-plus-circle mr-2"></i> 添加到记录',
        logTitle: '已记录摄入',
        resetAll: '全部重置',
        sortBy: '排序:',
        sortTime: '时间',
        sortPercent: '百分比',
        forecastTitle: '剩余额度还能吃多少？',
        forecastSubtitle: '基于当前剩余百分比的换算结果',
        sortRisk: '风险',
        sortGrams: '克数',
        editTitle: '编辑记录',
        fishLabel: '鱼类',
        cancel: '取消',
        save: '保存更改',
        consumption: '摄入',
        limit: '限额',
        edit: '编辑',
        delete: '删除',
        confirmClear: '确定要清空所有记录并重置油箱吗？',
        weightPlaceholder: '例如: 150',
        enterValidWeight: '请输入有效的重量',
        statusSafe: '安全 (Safe)',
        statusWarning: '警告 (Warning)',
        statusDanger: '危险 (Danger)',
        statusOverload: '爆表 (Overload!)',
        categoryLabels: {
            'high-cost': '⚠️ 极高消耗 (每月限额 150g)',
            'medium-cost': '⚠️ 中等消耗 (每月限额 600-750g)',
            'low-cost': '✅ 低消耗 (每月限额 1200g+)',
            'extreme-cost': '⛔ 极毒 (3个月限额 50g)'
        }
    }
};
 
const fishDb = [
    // High Risk (150g)
    { name: "Bream (黑鲷)", name_en: "Bream", limit: 150, icon: "🐟", risk: "high", category: "high-cost" },
    { name: "Tailor (泰勒鱼)", name_en: "Tailor", limit: 150, icon: "🐟", risk: "high", category: "high-cost" },
    { name: "Silver Biddie (银米底)", name_en: "Silver Biddie", limit: 150, icon: "🐟", risk: "high", category: "high-cost" },
    
    // Medium Risk (600g - 750g)
    { name: "Squid (鱿鱼)", name_en: "Squid", limit: 600, icon: "🦑", risk: "med", category: "medium-cost" },
    { name: "Prawns (虾)", name_en: "Prawns", limit: 600, icon: "🦐", risk: "med", category: "medium-cost" },
    { name: "Crabs (蟹)", name_en: "Crabs", limit: 750, icon: "🦀", risk: "med", category: "medium-cost" },
    { name: "Silver Trevally (池鱼)", name_en: "Silver Trevally", limit: 750, icon: "🐟", risk: "med", category: "medium-cost" },
    
    // Low Risk (1200g+)
    { name: "Sand Whiting (沙钻)", name_en: "Sand Whiting", limit: 1200, icon: "🐟", risk: "low", category: "low-cost" },
    { name: "Yellowtail Scad (黄尾池)", name_en: "Yellowtail Scad", limit: 1200, icon: "🐟", risk: "low", category: "low-cost" },
    { name: "Kingfish (青甘)", name_en: "Kingfish", limit: 1800, icon: "🐠", risk: "low", category: "low-cost", selected: true },
    { name: "Dusky Flathead (扁头鱼)", name_en: "Dusky Flathead", limit: 1800, icon: "🐡", risk: "low", category: "low-cost" },
    { name: "Luderick (黑毛)", name_en: "Luderick", limit: 1800, icon: "🐟", risk: "low", category: "low-cost" },
    { name: "Trumpeter Whiting (花沙钻)", name_en: "Trumpeter Whiting", limit: 1800, icon: "🐟", risk: "low", category: "low-cost" },
    { name: "Flounder (比目鱼)", name_en: "Flounder", limit: 1800, icon: "🐟", risk: "low", category: "low-cost" },
    { name: "Leatherjacket (剥皮鱼)", name_en: "Leatherjacket", limit: 3600, icon: "🦈", risk: "low", category: "low-cost" },
    
    // Extreme Risk
    { name: "Sea Mullet (海乌头)", name_en: "Sea Mullet", limit: 16.6, icon: "⛔", risk: "extreme", category: "extreme-cost" }
];

function setWeight(val) {
    domElements.weightInput.value = val;
}

function updateGauge(percentage) {
    // Cap at 100 for visual sanity, but track overflow
    const visualPercent = Math.min(percentage, 100);
    const remaining = 100 - visualPercent;
    
    // Color Logic
    let color = '#10B981'; // Green
    let status = translations[currentLang].statusSafe;
    let statusColorClass = 'text-green-600';

    if (percentage >= 50 && percentage < 80) {
        color = '#F59E0B'; // Orange
        status = translations[currentLang].statusWarning;
        statusColorClass = 'text-yellow-600';
    } else if (percentage >= 80 && percentage < 100) {
        color = '#EF4444'; // Red
        status = translations[currentLang].statusDanger;
        statusColorClass = 'text-red-600';
    } else if (percentage >= 100) {
        color = '#7f1d1d'; // Dark Red
        status = translations[currentLang].statusOverload;
        statusColorClass = 'text-red-900';
    }

    // Update Chart
    gaugeChart.data.datasets[0].backgroundColor[0] = color;
    gaugeChart.data.datasets[0].data = [visualPercent, remaining];
    gaugeChart.data.datasets[0].backgroundColor[1] = '#E5E7EB'; // gray-200
    gaugeChart.update();

    // Update Text
    domElements.percentageDisplay.innerText = percentage.toFixed(1) + '%';
    if (percentage > 100) domElements.percentageDisplay.classList.add('text-red-600');
    else domElements.percentageDisplay.classList.remove('text-red-600');

    domElements.statusText.innerText = status;
    domElements.statusText.className = `text-sm font-medium ${statusColorClass}`;

    const remainingText = domElements.remainingText;
    const rem = Math.max(0, 100 - percentage);
    remainingText.innerText = rem.toFixed(1) + '%';

    domElements.progressBar.style.width = Math.min(percentage, 100) + '%';
    domElements.progressBar.className = `h-2.5 rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-600' : (percentage > 50 ? 'bg-yellow-500' : 'bg-green-600')}`;

    updateForecast(rem);
}

function updateForecast(remainingPercent) {
    domElements.forecastGrid.innerHTML = '';

    // Create a temporary array with calculated grams
    const forecastData = fishDb.map(fish => ({
        ...fish,
        gramsAllowed: Math.floor(fish.limit * (remainingPercent / 100))
    }));

    // Sort the temporary array
    if (currentForecastSort === 'risk') {
        // Sort by risk level (most dangerous first)
        forecastData.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
    } else { // 'grams'
        // Sort by grams allowed (highest first)
        forecastData.sort((a, b) => b.gramsAllowed - a.gramsAllowed);
    }

    forecastData.forEach(fish => {
        const gramsAllowed = fish.gramsAllowed;
        
        let bgColor = 'bg-green-50';
        let textColor = 'text-gray-800';
        let extraClass = '';
        
        if (fish.risk === 'high') bgColor = 'bg-orange-50';
        if (fish.risk === 'extreme') bgColor = 'bg-red-50';

        if (gramsAllowed <= 0) {
            bgColor = 'bg-gray-100 opacity-50';
            textColor = 'text-gray-400';
            extraClass = 'grayscale';
        }

        const html = `
            <div class="${bgColor} ${extraClass} p-3 rounded-lg border border-gray-100 flex flex-col justify-between transition hover:shadow-md" title="${currentLang === 'en' ? fish.name : fish.name_en}">
                <div class="text-xs text-gray-500 mb-1 truncate" title="${currentLang === 'en' ? fish.name_en : fish.name}">${fish.icon} ${currentLang === 'en' ? fish.name_en : fish.name}</div>
                <div class="text-xl font-bold ${textColor}">${gramsAllowed}<span class="text-xs font-normal">g</span></div>
            </div>
        `;
        domElements.forecastGrid.insertAdjacentHTML('beforeend', html);
    });
}

function addEntry() {
    const weight = parseFloat(domElements.weightInput.value);

    if (!weight || weight <= 0) {
        alert(translations[currentLang].enterValidWeight);
        return;
    }

    const option = domElements.fishSelect.options[domElements.fishSelect.selectedIndex];
    const limit = parseFloat(option.value);
    const name = option.getAttribute('data-name');
    
    // Find the fish in the database to get its icon
    const fish = fishDb.find(f => f.name === name);
    const icon = fish ? fish.icon : '🐟'; // Use a fallback icon if not found

    // Calculate percentage used by this entry
    const percentageUsed = (weight / limit) * 100;

    // Update Global State
    totalPercentageUsed += percentageUsed;
    
    // Add to log
    logs.push({
        name: name,
        weight: weight,
        percent: percentageUsed,
        limit: limit,
        icon: icon,
        timestamp: Date.now() // Add timestamp
    });

    // Update UI
    renderLogs();
    updateGauge(totalPercentageUsed);
    
    // Reset input
    domElements.weightInput.value = '';
    saveLogsToLocalStorage();
}

let currentSort = 'date'; // Default sort

function renderLogs() {
    if (logs.length > 0) {
        domElements.logSection.classList.remove('hidden');
    } else {
        domElements.logSection.classList.add('hidden');
        return;
    }

    // Sort logs before rendering
    if (currentSort === 'date') {
        logs.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    } else if (currentSort === 'percent') {
        logs.sort((a, b) => b.percent - a.percent); // Highest percent first
    }

    domElements.logList.innerHTML = '';
    logs.forEach((log, index) => {
        // For backward compatibility with old logs in localStorage that might not have an icon
        const icon = log.icon || (fishDb.find(f => f.name === log.name) || {}).icon || '🐟';
        const date = new Date(log.timestamp).toLocaleDateString(currentLang === 'en' ? 'en-AU' : 'zh-CN', { month: 'short', day: 'numeric' });
        const fish = fishDb.find(f => f.name === log.name); // Find original fish to get translated name
        const displayName = fish ? (currentLang === 'en' ? fish.name_en : fish.name) : log.name;

        domElements.logList.innerHTML += `
            <li class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div class="flex items-center">
                    <span class="text-xl mr-3">${icon}</span>
                    <div>
                        <div class="font-medium text-gray-800 flex items-center" title="${displayName}">
                            ${displayName}
                            <span class="ml-2 text-xs text-gray-400 font-normal">${date}</span>
                        </div>
                        <div class="text-xs text-gray-500">${translations[currentLang].consumption}: ${log.weight}g / ${translations[currentLang].limit}: ${log.limit}g</div>
                    </div>
                </div>
                <div class="text-right ml-2">
                    <div class="font-bold text-red-500 text-lg">+${log.percent.toFixed(1)}%</div>
                    <div class="mt-1">
                        <button onclick="editLog(${index})" class="text-xs text-gray-400 hover:text-blue-500 mr-2"><i class="fas fa-edit"></i> ${translations[currentLang].edit}</button>
                        <button onclick="removeLog(${index})" class="text-xs text-gray-400 hover:text-red-500"><i class="fas fa-trash"></i> ${translations[currentLang].delete}</button>
                    </div>
                </div>
            </li>
        `;
    });
}

function removeLog(index) {
    const log = logs[index];
    totalPercentageUsed -= log.percent;
    // Prevent floating point weirdness below zero
    if (totalPercentageUsed < 0) totalPercentageUsed = 0;
    
    logs.splice(index, 1);
    renderLogs();
    updateGauge(totalPercentageUsed);
    saveLogsToLocalStorage();
}

function clearLogs() {
    if(confirm(translations[currentLang].confirmClear)) {
        logs = [];
        totalPercentageUsed = 0;
        renderLogs();
        updateGauge(0);
        saveLogsToLocalStorage();
    }
}

let editingLogIndex = null;

function editLog(index) {
    editingLogIndex = index;
    const log = logs[index];

    // Populate the modal with the log's data
    domElements.editFishSelect.value = log.limit;
    domElements.editWeightInput.value = log.weight;

    // Show the modal
    domElements.editModal.classList.remove('hidden');
}

function cancelEdit() {
    editingLogIndex = null;
    domElements.editModal.classList.add('hidden');
}

function saveLogChanges() {
    if (editingLogIndex === null) return;

    const newWeight = parseFloat(domElements.editWeightInput.value);
    const select = domElements.editFishSelect;
    const newLimit = parseFloat(select.value);
    const newName = select.options[select.selectedIndex].dataset.name;

    if (!newWeight || newWeight <= 0) {
        alert(translations[currentLang].enterValidWeight);
        return;
    }

    // Update the log entry
    const logToUpdate = logs[editingLogIndex];
    logToUpdate.weight = newWeight;
    logToUpdate.limit = newLimit;
    logToUpdate.name = newName;
    logToUpdate.percent = (newWeight / newLimit) * 100;
    logToUpdate.icon = (fishDb.find(f => f.name === newName) || {}).icon || '🐟';
    // Keep the original timestamp

    // Recalculate total and update UI
    totalPercentageUsed = logs.reduce((total, log) => total + log.percent, 0);
    renderLogs();
    updateGauge(totalPercentageUsed);
    saveLogsToLocalStorage();
    cancelEdit(); // Close modal
}

function sortLogs(sortBy) {
    currentSort = sortBy;
    // Update button styles
    if (sortBy === 'date') {
        domElements.sortDateBtn.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium focus:outline-none';
        domElements.sortPercentBtn.className = 'px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 focus:outline-none';
    } else { // percent
        domElements.sortPercentBtn.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium focus:outline-none';
        domElements.sortDateBtn.className = 'px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 focus:outline-none';
    }
    renderLogs();
}

function sortForecast(sortBy) {
    currentForecastSort = sortBy;
    // Update button styles
    if (sortBy === 'risk') {
        domElements.sortForecastRiskBtn.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium focus:outline-none';
        domElements.sortForecastGramsBtn.className = 'px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 focus:outline-none';
    } else { // grams
        domElements.sortForecastGramsBtn.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium focus:outline-none';
        domElements.sortForecastRiskBtn.className = 'px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 focus:outline-none';
    }
    // Re-render the forecast section with the new sort order
    const remainingPercent = Math.max(0, 100 - totalPercentageUsed);
    updateForecast(remainingPercent);
}

function populateFishSelect() {
    // Group fish by category
    const groupedFish = fishDb.reduce((acc, fish) => {
        (acc[fish.category] = acc[fish.category] || []).push(fish);
        return acc;
    }, {});

    domElements.fishSelect.innerHTML = ''; // Clear existing options

    // Use the order of categoryLabels to ensure consistent dropdown order
    for (const category in translations[currentLang].categoryLabels) {
        if (groupedFish[category]) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = translations[currentLang].categoryLabels[category];

            groupedFish[category].forEach(fish => {
                const option = document.createElement('option');
                option.value = fish.limit;
                const displayName = currentLang === 'en' ? fish.name_en : fish.name;
                option.textContent = `${fish.icon} ${displayName} - ${translations[currentLang].limit} ${fish.limit}g`;
                option.dataset.name = fish.name;
                if (fish.selected) {
                    option.selected = true;
                }
                optgroup.appendChild(option);
            });
            domElements.fishSelect.appendChild(optgroup);
            // Also populate the edit modal's select
            const clone = optgroup.cloneNode(true);
            domElements.editFishSelect.appendChild(clone);
        }
    }
}

function saveLogsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
}

function loadLogsFromLocalStorage() {
    const savedLogs = localStorage.getItem(LOCAL_STORAGE_KEY);
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    if (savedLogs) {
        let loadedLogs = JSON.parse(savedLogs);

        // Filter out logs older than one month
        logs = loadedLogs.filter(log => {
            // For backward compatibility, keep logs without a timestamp
            return !log.timestamp || log.timestamp > oneMonthAgo;
        });

        // If some logs were expired, save the cleaned list back to localStorage
        if (logs.length < loadedLogs.length) {
            console.log(`${loadedLogs.length - logs.length} expired log(s) removed.`);
            saveLogsToLocalStorage();
        }
        
        // Recalculate total percentage from the remaining logs
        totalPercentageUsed = logs.reduce((total, log) => total + log.percent, 0);
        
        // Render the UI with loaded data
        renderLogs();
        updateGauge(totalPercentageUsed);
    } else {
        // If no saved logs, just initialize the UI
        updateGauge(0); // This will also call updateForecast
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    updateUIText();
    updateLangToggleBtn();
}

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
}

function updateUIText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    // Re-render dynamic parts
    populateFishSelect();
    renderLogs();
    updateGauge(totalPercentageUsed);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache all DOM elements
    domElements.gaugeChartCanvas = document.getElementById('gaugeChart');
    domElements.percentageDisplay = document.getElementById('percentageDisplay');
    domElements.statusText = document.getElementById('statusText');
    domElements.remainingText = document.getElementById('remainingText');
    domElements.progressBar = document.getElementById('progressBar');
    domElements.fishSelect = document.getElementById('fishSelect');
    domElements.weightInput = document.getElementById('weightInput');
    domElements.logSection = document.getElementById('logSection');
    domElements.logList = document.getElementById('logList');
    domElements.forecastGrid = document.getElementById('forecastGrid');
    domElements.sortDateBtn = document.getElementById('sortDateBtn');
    domElements.sortPercentBtn = document.getElementById('sortPercentBtn');
    domElements.editModal = document.getElementById('editModal');
    domElements.editFishSelect = document.getElementById('editFishSelect');
    domElements.editWeightInput = document.getElementById('editWeightInput');
    domElements.saveEditBtn = document.getElementById('saveEditBtn');
    domElements.sortForecastRiskBtn = document.getElementById('sortForecastRiskBtn');
    domElements.sortForecastGramsBtn = document.getElementById('sortForecastGramsBtn');
    domElements.langToggleBtn = document.getElementById('langToggleBtn');

    // 2. Initialize Chart.js
    const ctx = domElements.gaugeChartCanvas.getContext('2d');
    gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['已用', '剩余'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#10B981', '#E5E7EB'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
                cutout: '80%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });

    // 3. Load language (must be after chart init, because it triggers a UI update)
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'zh';
    setLanguage(savedLang);

    // 4. Load data from Local Storage and update UI
    loadLogsFromLocalStorage();

    // 5. Populate UI text for the first time (this is now redundant as setLanguage does it)
    updateUIText();

    // 6. Add event listeners
    domElements.saveEditBtn.addEventListener('click', saveLogChanges);
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
    domElements.langToggleBtn.addEventListener('click', toggleLanguage);
});

function updateLangToggleBtn() {
    const enText = domElements.langToggleBtn.querySelector('.en-text');
    const zhText = domElements.langToggleBtn.querySelector('.zh-text');
    enText.classList.toggle('hidden', currentLang !== 'en');
    zhText.classList.toggle('hidden', currentLang !== 'zh');
}