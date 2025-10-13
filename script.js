// 初始化数据
let villageData = {
    food: 80,
    morale: getRandom(50, 70),
    comfort: getRandom(50, 70),
    order: getRandom(50, 70),
    prosperity: getRandom(50, 70),
    currentRound: 1,
    hasStormDebuff: false,
    hasRestBonus: false,
    stormTargetProp: null,
    foodPromote100Reduce0: false,
    moraleProsperity150: false,
    comfortForceRest: false,
    orderEventHalf: false,
    prosperityAll125: false,
    // 士气预见相关状态
    moraleForeseeDamage: null, // 预见到的下轮损耗属性
    nextLossEvent: null,       // 预存的下轮损耗事件
};

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
    updateProperty('food');
    updateProperty('morale');
    updateProperty('comfort');
    updateProperty('order');
    updateProperty('prosperity');
    document.getElementById('currentRound').innerText = villageData.currentRound;
}

function updateProperty(property) {
    const value = villageData[property];
    const valueElem = document.getElementById(`${property}-value`);
    const chartElem = document.getElementById(`${property}-chart`);

    valueElem.innerText = value;
    const maxVisualValue = 150;
    const widthPercent = Math.min((value / maxVisualValue) * 100, 100);
    chartElem.style.width = `${widthPercent}%`;

    if (value <= 0) chartElem.className = 'chart-fill low';
    else if (value > 100) chartElem.className = 'chart-fill high';
    else chartElem.className = 'chart-fill normal';
}

function addLog(text) {
    const logContainer = document.getElementById('logContainer');
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('p');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span>[${time}]</span> ${text}`;
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    logContainer.scrollTop = 0;
}

// 检查士气是否达标并生成预见
function checkMoraleForecast() {
    // 只有当士气 > 100时才生成预见
    if (villageData.morale > 100) {
        // 生成下轮事件池
        let eventPool = getEventPoolByRound(villageData.currentRound + 1);
        // 随机选择一个事件作为下轮损耗事件
        villageData.nextLossEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
        
        // 排除暴风雨前兆（本身有单独预告）
        if (villageData.nextLossEvent.name !== '暴风雨的前兆') {
            villageData.moraleForeseeDamage = villageData.nextLossEvent.prop;
            addLog(`[士气预见] 下轮损耗事件将降低${getPropName(villageData.moraleForeseeDamage)}！`);
        } else {
            // 暴风雨前兆单独处理
            const targetProps = ['morale', 'comfort', 'order', 'prosperity'];
            villageData.stormTargetProp = targetProps[Math.floor(Math.random() * targetProps.length)];
            addLog(`[士气预见] 下轮将出现暴风雨的前兆，后续会降低${getPropName(villageData.stormTargetProp)}！`);
        }
    } else {
        // 士气不足100，清除预见
        villageData.moraleForeseeDamage = null;
        villageData.nextLossEvent = null;
    }
}

// 根据轮次获取事件池
function getEventPoolByRound(round) {
    let eventPool = [];
    if (round <= 5) {
        eventPool = [
            {name: '受潮', prop: 'food', min:10, max:30},
            {name: '打架事件', prop: 'morale', min:10, max:30},
            {name: '降温', prop: 'comfort', min:10, max:30},
            {name: '村民不满', prop: 'order', min:10, max:30},
            {name: '商业失误', prop: 'prosperity', min:10, max:30}
        ];
    } else if (round <= 10) {
        eventPool = [
            {name: '受潮', prop: 'food', min:10, max:30},
            {name: '鼠患', prop: 'food', min:30, max:60},
            {name: '粮仓起火', prop: 'food', min:50, max:70},
            {name: '打架事件', prop: 'morale', min:10, max:30},
            {name: '流言四起', prop: 'morale', min:30, max:60},
            {name: '出现逃兵', prop: 'morale', min:50, max:70},
            {name: '降温', prop: 'comfort', min:10, max:30},
            {name: '降雪', prop: 'comfort', min:30, max:60},
            {name: '冰雹', prop: 'comfort', min:50, max:70},
            {name: '村民不满', prop: 'order', min:10, max:30},
            {name: '村民抗议', prop: 'order', min:30, max:60},
            {name: '村民暴动', prop: 'order', min:50, max:70},
            {name: '商业失误', prop: 'prosperity', min:10, max:30},
            {name: '商业陷阱', prop: 'prosperity', min:30, max:60},
            {name: '被打劫', prop: 'prosperity', min:50, max:70}
        ];
    } else if (round <= 14) {
        eventPool = [
            {name: '鼠患', prop: 'food', min:30, max:60},
            {name: '粮仓起火', prop: 'food', min:50, max:70},
            {name: '流言四起', prop: 'morale', min:30, max:60},
            {name: '出现逃兵', prop: 'morale', min:50, max:70},
            {name: '降雪', prop: 'comfort', min:30, max:60},
            {name: '冰雹', prop: 'comfort', min:50, max:70},
            {name: '村民抗议', prop: 'order', min:30, max:60},
            {name: '村民暴动', prop: 'order', min:50, max:70},
            {name: '商业陷阱', prop: 'prosperity', min:30, max:60},
            {name: '被打劫', prop: 'prosperity', min:50, max:70},
            {name: '暴风雨的前兆', prop: 'none', min:0, max:0}
        ];
    } else {
        eventPool = [
            {name: '粮仓起火', prop: 'food', min:50, max:70},
            {name: '出现逃兵', prop: 'morale', min:50, max:70},
            {name: '冰雹', prop: 'comfort', min:50, max:70},
            {name: '村民暴动', prop: 'order', min:50, max:70},
            {name: '被打劫', prop: 'prosperity', min:50, max:70}
        ];
    }
    return eventPool;
}

function chooseFixed(property) {
    let addValue = 0;
    if (property === 'food') addValue = getRandom(40, 60);
    else addValue = getRandom(30, 50);

    if (villageData.prosperityAll125) {
        const bonus125 = Math.floor(addValue * 0.25);
        addValue += bonus125;
        addLog(`[高点数奖励-繁荣] 所有收益×125%（额外+${bonus125}）`);
        villageData.prosperityAll125 = false;
    }

    if (property === 'prosperity' && villageData.moraleProsperity150) {
        const bonus150 = Math.floor(addValue * 0.5);
        addValue += bonus150;
        addLog(`[高点数奖励-士气] 繁荣收益×150%（额外+${bonus150}）`);
        villageData.moraleProsperity150 = false;
    }

    if (villageData.hasRestBonus) {
        const restBonus = Math.floor(addValue * 2);
        addValue += restBonus;
        addLog(`[养精蓄锐] ${getPropName(property)}收益×300%（额外+${restBonus}）`);
        villageData.hasRestBonus = false;
    }

    checkSynergy(property, addValue);

    // 更新属性后检查士气是否达标
    villageData[property] += addValue;
    addLog(`[固定选择] 选择${getPropName(property)}，共增加${addValue}点（当前值：${villageData[property]}）`);

    // 关键：只要士气 >= 100，立即生成下轮损耗预见
    if (property === 'morale' || villageData.morale >= 100) {
        checkMoraleForecast();
    }

    checkHighValueReward(property);

    updateUI();
    setTimeout(triggerLossEvent, 1200);
}

function getPropName(property) {
    const nameMap = {
        food: '粮食产出',
        morale: '士气',
        comfort: '舒适',
        order: '秩序',
        prosperity: '繁荣'
    };
    return nameMap[property];
}

function checkSynergy(currentProp, addValue) {
    const promoteRate = villageData.foodPromote100Reduce0 ? 100 : 60;
    const reduceRate = villageData.foodPromote100Reduce0 ? 0 : 40;

    // 繁荣连携：60%几率增加0.65倍此次增加值的粮食
    if (currentProp === 'prosperity') {
        if (Math.random() * 100 < 60) {
            const bonus = Math.floor(addValue * 0.65);
            villageData.food += bonus;
            addLog(`[连携促进-繁荣] 繁荣增加→粮食额外+${bonus}（当前粮食：${villageData.food}）`);
            updateUI();
        }
    } 
    // 士气连携可能会影响士气值，需要在连携后检查预见
    else if (currentProp === 'morale') {
        if (Math.random() * 100 < promoteRate) {
            const bonus = Math.floor(addValue * 0.5);
            villageData.comfort += bonus;
            addLog(`[连携促进-士气] 士气增加→舒适额外+${bonus}`);
            updateUI();
        } else if (Math.random() * 100 < reduceRate) {
            const reduce = Math.floor(addValue * 0.4);
            villageData.comfort = Math.max(villageData.comfort - reduce, 0);
            villageData.order = Math.max(villageData.order - reduce, 0);
            addLog(`[连携降低-士气] 士气增加→舒适-${reduce}、秩序-${reduce}`);
            updateUI();
        }
        
        // 连携后检查士气是否达标
        if (villageData.morale + addValue >= 100) {
            checkMoraleForecast();
        }
    } 
    else if (currentProp === 'food') {
        if (Math.random() * 100 < promoteRate) {
            const bonus = Math.floor(addValue * 0.5);
            villageData.morale += bonus;
            addLog(`[连携促进-粮食] 粮食增加→士气额外+${bonus}（当前士气：${villageData.morale}）`);
            updateUI();
            // 粮食连携可能增加士气，检查是否达标
            if (villageData.morale > 100) {
                checkMoraleForecast();
            }
        } else if (Math.random() * 100 < reduceRate) {
            const reduce = Math.floor(addValue * 0.25);
            villageData.comfort = Math.max(villageData.comfort - reduce, 0);
            villageData.order = Math.max(villageData.order - reduce, 0);
            addLog(`[连携降低-粮食] 粮食增加→舒适-${reduce}、秩序-${reduce}`);
            updateUI();
        }
        if (villageData.foodPromote100Reduce0) villageData.foodPromote100Reduce0 = false;
    } 
    else if (currentProp === 'comfort') {
        if (Math.random() * 100 < promoteRate) {
            const bonus = Math.floor(addValue * 0.5);
            villageData.order += bonus;
            addLog(`[连携促进-舒适] 舒适增加→秩序额外+${bonus}`);
            updateUI();
        } else if (Math.random() * 100 < reduceRate) {
            const reduce = Math.floor(addValue * 0.4);
            villageData.prosperity = Math.max(villageData.prosperity - reduce, 0);
            addLog(`[连携降低-舒适] 舒适增加→繁荣-${reduce}`);
            updateUI();
        }
    } 
    else if (currentProp === 'order') {
        if (Math.random() * 100 < promoteRate) {
            let bonus = Math.random() < 0.5 ? Math.floor(addValue * 0.5) : Math.floor(addValue * 0.65);
            villageData.prosperity += bonus;
            addLog(`[连携促进-秩序] 秩序增加→繁荣额外+${bonus}`);
            updateUI();
        } else if (Math.random() * 100 < reduceRate) {
            const reduce = Math.floor(addValue * 0.4);
            villageData.morale = Math.max(villageData.morale - reduce, 0);
            addLog(`[连携降低-秩序] 秩序增加→士气-${reduce}`);
            updateUI();
            // 秩序连携可能降低士气，检查是否仍达标
            if (villageData.morale > 100) {
                checkMoraleForecast();
            }
        }
    }
}

function checkHighValueReward(property) {
    const value = villageData[property];
    if (value <= 100) return;

    switch (property) {
        case 'food':
            villageData.foodPromote100Reduce0 = true;
            villageData.food = 99;
            addLog(`[高点数奖励-粮食] 粮食＞100→下轮固定选择促进率100%、降低率0%，数值重置为99`);
            break;
        case 'morale':
            // 士气高点数奖励：保持>100持续有效
            addLog(`[高点数奖励-士气] 士气＞100→持续预见下轮损耗事件！`);
            checkMoraleForecast(); // 确保生成预见
            break;
        case 'comfort':
            villageData.comfortForceRest = true;
            villageData.comfort = 99;
            addLog(`[高点数奖励-舒适] 舒适＞100→下轮随机选择必定养精蓄锐，数值重置为99`);
            break;
        case 'order':
            villageData.orderEventHalf = true;
            villageData.order = 99;
            addLog(`[高点数奖励-秩序] 秩序＞100→下轮事件扣除减半，数值重置为99`);
            break;
        case 'prosperity':
            villageData.prosperityAll125 = true;
            villageData.prosperity = 99;
            addLog(`[高点数奖励-繁荣] 繁荣＞100→下轮所有收益×125%，数值重置为99`);
            break;
    }
    updateUI();
}

// 属性上限150 + 超100部分每轮减10
function handlePropCapAndReduction() {
    const props = ['food', 'morale', 'comfort', 'order', 'prosperity'];
    props.forEach(prop => {
        let value = villageData[prop];
        
        // 强制上限150
        if (value > 150) {
            const excess = value - 150;
            villageData[prop] = 150;
            addLog(`[属性上限] ${getPropName(prop)}超过150，强制降至150（超出${excess}点）`);
            value = 150;
        }
        
        // 超过100的部分每轮减10（不低于100）
        if (value > 100) {
            const over100 = value - 100;
            const reduce = Math.min(over100, 10);
            villageData[prop] = value - reduce;
            addLog(`[超量扣除] ${getPropName(prop)}超过100的部分-${reduce}（当前：${villageData[prop]}）`);
        }
    });

    // 检查士气状态，更新预见功能
    if (villageData.morale > 100) {
        checkMoraleForecast();
    } else {
        addLog(`[士气状态变化] 士气＜100→无法预见损耗事件属性`);
        villageData.moraleForeseeDamage = null;
        villageData.nextLossEvent = null;
    }
    updateUI();
}

function chooseRandom() {
    let eventType = '';

    if (villageData.comfortForceRest) {
        eventType = 'rest';
        addLog(`[高点数奖励-舒适] 随机选择必定触发养精蓄锐`);
        villageData.comfortForceRest = false;
    } else {
        const randomRate = Math.random() * 100;
        if (randomRate < 25) eventType = 'rest';
        else if (randomRate < 40) eventType = 'food';
        else if (randomRate < 55) eventType = 'morale';
        else if (randomRate < 70) eventType = 'comfort';
        else if (randomRate < 85) eventType = 'order';
        else eventType = 'prosperity';
    }

    if (eventType === 'rest') {
        villageData.hasRestBonus = true;
        addLog(`[随机事件] 养精蓄锐→下轮收益×300%`);
    } else {
        let baseAdd = eventType === 'food' ? getRandom(40, 60) : getRandom(30, 50);
        const bonus120 = Math.floor(baseAdd * 0.2);
        let totalAdd = baseAdd + bonus120;

        if (villageData.prosperityAll125) {
            const bonus125 = Math.floor(totalAdd * 0.25);
            totalAdd += bonus125;
            addLog(`[高点数奖励-繁荣] 所有收益×125%（额外+${bonus125}）`);
            villageData.prosperityAll125 = false;
        }

        checkSynergy(eventType, totalAdd);

        // 更新属性后检查士气是否达标
        villageData[eventType] += totalAdd;
        addLog(`[随机事件] ${getRandomEventName(eventType)}→基础+${baseAdd}、120%效率+${bonus120}，共+${totalAdd}（当前：${villageData[eventType]}）`);

        // 关键：随机事件增加士气后检查是否达标
        if (eventType === 'morale' || villageData.morale >= 100) {
            checkMoraleForecast();
        }

        checkHighValueReward(eventType);
    }

    updateUI();
    setTimeout(triggerLossEvent, 1200);
    document.querySelector('.choice-panel button:last-child').disabled = true;
}

function getRandomEventName(eventType) {
    const nameMap = {
        food: '大量增加农田人力',
        morale: '将军鼓舞士气',
        comfort: '分发双倍消费品',
        order: '严格守夜并训练民兵',
        prosperity: '大规模商业活动'
    };
    return nameMap[eventType];
}

function triggerLossEvent() {
    // 固定扣粮食
    villageData.food = Math.max(villageData.food - 10, 0);
    addLog(`[固定扣除] 粮食-10，剩余${villageData.food}点`);

    // 使用预存的事件或新生成事件
    let randomEvent;
    if (villageData.nextLossEvent) {
        randomEvent = villageData.nextLossEvent;
        villageData.nextLossEvent = null; // 清空预存事件
    } else {
        // 生成当前轮次的事件池
        const currentRound = villageData.currentRound;
        randomEvent = getEventPoolByRound(currentRound)[Math.floor(Math.random() * getEventPoolByRound(currentRound).length)];
    }

    // 执行事件
    if (randomEvent.name === '暴风雨的前兆') {
        const targetProps = ['morale', 'comfort', 'order', 'prosperity'];
        villageData.stormTargetProp = targetProps[Math.floor(Math.random() * targetProps.length)];
        addLog(`[特殊事件] 暴风雨的前兆→下轮降低${getPropName(villageData.stormTargetProp)}×200%`);
        villageData.hasStormDebuff = true;
    } else {
        let lossValue = getRandom(randomEvent.min, randomEvent.max);
        
        if (villageData.hasStormDebuff && villageData.stormTargetProp) {
            // 暴风雪倍率200%
            const stormBonus = Math.floor(lossValue * 1.0);
            lossValue += stormBonus;
            addLog(`[暴风雨生效] ${getPropName(villageData.stormTargetProp)}扣除×200%（共-${lossValue}）`);
            villageData[villageData.stormTargetProp] = Math.max(villageData[villageData.stormTargetProp] - lossValue, 0);
            villageData.hasStormDebuff = false;
            villageData.stormTargetProp = null;
        } else {
            if (villageData.orderEventHalf) {
                const halfLoss = Math.floor(lossValue / 2);
                lossValue = halfLoss;
                addLog(`[高点数奖励-秩序] 事件扣除减半→实际-${halfLoss}`);
                villageData.orderEventHalf = false;
            }
            villageData[randomEvent.prop] = Math.max(villageData[randomEvent.prop] - lossValue, 0);
            addLog(`[损耗事件] ${randomEvent.name}→${getPropName(randomEvent.prop)}-${lossValue}，剩余${villageData[randomEvent.prop]}`);
        }
    }

    updateUI();
    setTimeout(checkResult, 1200);
}

function checkResult() {
    const allProps = ['food', 'morale', 'comfort', 'order', 'prosperity'];
    const failedProp = allProps.find(prop => villageData[prop] <= 0);
    if (failedProp) {
        addLog(`[游戏结束] ${getPropName(failedProp)}≤0→村庄被摧毁`);
        showResult(`村庄被摧毁...（${getPropName(failedProp)}降至0以下）`);
        return;
    }

    if (villageData.currentRound === 15) {
        addLog(`[游戏胜利] 15轮后所有属性>0→成功保卫村庄`);
        showResult('村庄幸存！15轮后所有属性均大于0，保卫成功！');
        return;
    }

    // 每轮结束处理属性上限和超100扣除
    handlePropCapAndReduction();
    
    villageData.currentRound += 1;
    addLog(`[轮次切换] 第${villageData.currentRound - 1}轮结束→进入第${villageData.currentRound}轮`);
    document.querySelector('.choice-panel button:last-child').disabled = false;
}

function showResult(message) {
    document.getElementById('resultTitle').innerText = message;
    document.getElementById('choicePanel').style.display = 'none';
    document.getElementById('resultPanel').style.display = 'block';
}

function restartGame() {
    villageData = {
        food: 80,
        morale: getRandom(40, 60),
        comfort: getRandom(40, 60),
        order: getRandom(40, 60),
        prosperity: getRandom(40, 60),
        currentRound: 1,
        hasStormDebuff: false,
        hasRestBonus: false,
        stormTargetProp: null,
        foodPromote100Reduce0: false,
        moraleProsperity150: false,
        comfortForceRest: false,
        orderEventHalf: false,
        prosperityAll125: false,
        moraleForeseeDamage: null,
        nextLossEvent: null,
    };
    document.getElementById('choicePanel').style.display = 'block';
    document.getElementById('resultPanel').style.display = 'none';
    document.getElementById('logContainer').innerHTML = '<p class="log-entry">游戏开始！第1轮即将开始</p>';
    document.querySelector('.choice-panel button:last-child').disabled = false;
    updateUI();
}

// 初始化游戏
updateUI();
     