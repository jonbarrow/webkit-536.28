if (this.importScripts) {
    importScripts('../../../fast/js/resources/js-test-pre.js');
    importScripts('shared.js');
}

description("Test IndexedDB odd value datatypes");

function test()
{
    removeVendorPrefixes();

    name = self.location.pathname;
    request = evalAndLog("indexedDB.open(name)");
    request.onsuccess = openSuccess;
    request.onerror = unexpectedErrorCallback;
}

function openSuccess()
{
    db = evalAndLog("db = event.target.result");

    request = evalAndLog("request = db.setVersion('1')");
    request.onsuccess = addKey1;
    request.onerror = unexpectedErrorCallback;
}

function addKey1()
{
    deleteAllObjectStores(db);

    objectStore = evalAndLog("db.createObjectStore('foo', {autoIncrement: true});");

    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    imagedata = context.createImageData(1, 1);
    validTypes = [{ description: 'regexp',    value: new RegExp('\\\\') },
                  { description: 'date',      value: new Date(0) },
                  { description: 'object',    value: new Object() },
                  { description: 'imagedata', value: imagedata },
    ];
    nextToAdd = 0;
    addData();
}

function addData()
{
    debug("adding " + validTypes[nextToAdd].description + " value");
    result = evalAndLog("objectStore.add(validTypes[nextToAdd].value)");
    result.onsuccess = ++nextToAdd < validTypes.length ? addData : openACursor;
    result.onerror = unexpectedErrorCallback;
}

function openACursor()
{
    valueIndex = 0;
    request = evalAndLog("request = objectStore.openCursor();");
    request.onerror = unexpectedErrorCallback;
    request.onsuccess = function (event) {
        cursor = evalAndLog("cursor = event.target.result;");
        if (cursor) {
            shouldBe("cursor.value.toString()", "validTypes[valueIndex].value.toString()");
            if (valueIndex == 1) {
                shouldBe("cursor.value.toUTCString()", "'Thu, 01 Jan 1970 00:00:00 GMT'");
            }
            if (valueIndex == 3) {
                shouldBe("cursor.value.width", "1");
            }
            evalAndLog("cursor.continue();");
            evalAndLog("valueIndex++;");
        }
        else {
            finishJSTest();
        }
    }
}

test();