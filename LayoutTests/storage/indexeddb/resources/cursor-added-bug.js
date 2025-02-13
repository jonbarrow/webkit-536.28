if (this.importScripts) {
    importScripts('../../../fast/js/resources/js-test-pre.js');
    importScripts('shared.js');
}

description("Test IndexedDB cursor iterates correctly over values added during iteration.");

test();

function test()
{
    removeVendorPrefixes();
    request = evalAndLog("indexedDB.open('cursor-delete')");
    request.onsuccess = openSuccess;
    request.onerror = unexpectedErrorCallback;
}

function openSuccess()
{
    var db = evalAndLog("db = event.target.result");

    request = evalAndLog("db.setVersion('new version')");
    request.onsuccess = setVersionSuccess;
    request.onerror = unexpectedErrorCallback;
}

function setVersionSuccess()
{
    trans = evalAndLog("trans = event.target.result");
    shouldBeTrue("trans !== null");
    trans.onabort = unexpectedAbortCallback;
    trans.oncomplete = openCursor;

    deleteAllObjectStores(db);

    var objectStore = evalAndLog("objectStore = db.createObjectStore('test')");
    evalAndLog("objectStore.add(1, 1)");
    evalAndLog("objectStore.add(2, 2)");
    evalAndLog("objectStore.add(3, 3)");
}

function openCursor()
{
    evalAndLog("trans = db.transaction(['test'], IDBTransaction.READ_WRITE)");
    trans.onabort = finishJSTest;
    trans.oncomplete = finishJSTest;
    request = evalAndLog("trans.objectStore('test').openCursor()");
    request.onsuccess = cursorSuccess;
    request.onerror = unexpectedErrorCallback;
    counter = 0;
}

function cursorSuccess()
{
    if (event.target.result == null) {
      shouldBe("counter", "6");
      return;
    }

    counter = counter + 1;

    shouldBe("event.target.result.key", String(counter));
    if (event.target.result.key == 1) {
      evalAndLog("trans.objectStore('test').add(6, 6)");
    }
    if (event.target.result.key == 2) {
      evalAndLog("trans.objectStore('test').add(5, 5)");
    }
    if (event.target.result.key == 3) {
      evalAndLog("trans.objectStore('test').add(4, 4)");
    }

    evalAndLog("event.target.result.continue()");
}
