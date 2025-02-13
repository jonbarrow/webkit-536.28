description("Tests basic use of GestureFlingStart");

var expectedWheelEventsOccurred = "2";
var actualWheelEventsOccurred = 0;

function recordWheelEvent(event)
{
    shouldBe('event.clientX', "10");
    shouldBe('event.clientY', "11");

    // Test deliberately does not equality check wheelDeltas to not be fragile in the face of curve adjustment.
    shouldBeTrue("event.wheelDeltaX > 5");
    shouldBeTrue("event.wheelDeltaY > 5");
    actualWheelEventsOccurred++;
}

document.addEventListener("mousewheel", recordWheelEvent);

if (window.layoutTestController && window.eventSender && window.eventSender.gestureFlingStart) {
    eventSender.gestureFlingStart(10, 11, 1000, 1000);
    layoutTestController.display();
    layoutTestController.display();
    layoutTestController.display();
}

setTimeout(function() {
    shouldBe('actualWheelEventsOccurred', expectedWheelEventsOccurred);
}, 100);

if (window.layoutTestController)
    layoutTestController.waitUntilDone();

setTimeout(function() {
    isSuccessfullyParsed();
    if (window.layoutTestController)
        layoutTestController.notifyDone();
}, 200);
