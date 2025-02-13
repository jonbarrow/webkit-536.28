description('Tests using BatteryStatus from multiple frames.');

var charging = false;
var chargingTime = Number.POSITIVE_INFINITY;
var dischargingTime = 6000;
var level = 0.7;

var battery = navigator.webkitBattery;

function checkBatteryStatus() {
    shouldBe('battery.charging', 'charging');
    shouldBe('battery.chargingTime', 'chargingTime');
    shouldBe('battery.dischargingTime', 'dischargingTime');
    shouldBe('battery.level', 'level');
}

function checkChildBatteryStatus() {
    shouldBe('battery.charging', 'charging');
    shouldBe('battery.chargingTime', 'chargingTime');
    shouldBe('battery.dischargingTime', 'dischargingTime');
    shouldBe('battery.level', 'level');
}

var hasMainFrameEventFired = false;
function mainFrameListener() {
    hasMainFrameEventFired = true;
    maybeFinishTest();
}

var hasChildFrameEventFired = false;
function childFrameListener() {
    hasChildFrameEventFired = true;
    maybeFinishTest();
}

function maybeFinishTest() {
    if (hasMainFrameEventFired && hasChildFrameEventFired) {
        checkBatteryStatus();
        checkChildBatteryStatus();
        finishJSTest();
    }
}

var childFrame = document.createElement('iframe');
document.body.appendChild(childFrame);
var childBattery = childFrame.contentWindow.navigator.webkitBattery
childBattery.addEventListener('chargingchange', childFrameListener);
battery.addEventListener('chargingchange', mainFrameListener);

internals.setBatteryStatus(document, 'chargingchange', charging, chargingTime, dischargingTime, level);
window.jsTestIsAsync = true;
