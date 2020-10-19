var pq = 0.75; /* preview quality */
var rq = 2; /* render quality */
var m = 1; /* magnification */

var card, art;
var cardImageSize = {
    "bg": {"width": 756, "height": 1134},
    "np": {"width": 720, "height": 120},
    "ib": {"width": 436, "height": 981}
};
var cardImage = {
    "bgDefault": undefined,
    "bgDefaultDragon": undefined,
    "bgUpload": undefined,
    "ibDefaultChar": undefined,
    "ibDefaultArmor": undefined,
    "ibDefaultAgon": undefined,
    "ibUpload": undefined
};
var cardGradientData = {
    "bg": undefined,
    "np": undefined,
    "ib": undefined
};
var cardImageData = {
    "bgDefault": undefined,
    "bgDefaultDragon": undefined,
    "bgUpload": undefined,
    "ibDefault": undefined,
    "ibDefaultArmor": undefined,
    "ibDefaultAgon": undefined,
    "ibUpload": undefined
};
var renderCard;

/* General Functions */

function newImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.addEventListener("load", function () {
            resolve(img);
        });
        img.addEventListener("error", function () {
            reject(img);
        });
        img.src = url;
    });
}

function newCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

/* Menu (mostly) */

var deeperHex = function () {
    function deeperHexSlice(hexslice, depth) {
        var n = parseInt(hexslice, 16);
        var value = Math.pow(n, depth) / Math.pow(16, 2 * (depth - 1));
        return Math.floor(value).toString(16).padStart(2, 0);
    }

    return function (hex, depth) {
        if (hex.length == 4 || hex.length == 5) {
            var shortHex = hex;
            hex = "";
            for (var i = 0; i < shortHex.length; i++) {
                hex += shortHex.slice(i, i + 2);
            }
        }
        if (hex.length != 7 && hex.length != 9) {
            throw "Error: Invalid hexadecimal value.";
        }
        var r = deeperHexSlice(hex.slice(1, 3), depth);
        var g = deeperHexSlice(hex.slice(3, 5), depth);
        var b = deeperHexSlice(hex.slice(5, 7), depth);
        var a = hex.slice(7, 9);
        return "#" + r + g + b + a;
    };
}();

function initColorInput(color0, color1, colorAuto, colorAutoChecked, depth, update) {
    function onChangeColor() {
        if (color0.value.length == 4 || color0.value.length == 7) {
            if (colorAuto.checked && depth) {
                color1.jscolor.fromString(deeperHex(color0.value, depth));
            }
            if (color1.value.length == 4 || color1.value.length == 7) {
                update(color0, color1);
            }
        }
    }

    function onInputColorAuto() {
        if (colorAuto.checked) {
            color1.setAttribute("disabled", true);
            if (!depth) {
                color1.jscolor.fromString("#000000");
            }
        }
        else {
            color1.removeAttribute("disabled");
        }
        onChangeColor();
    }

    color0.jscolor.onInput = onChangeColor;
    color1.jscolor.onInput = onChangeColor;

    colorAuto.addEventListener("input", onInputColorAuto);

    colorAuto.checked = colorAutoChecked;
    colorAuto.dispatchEvent(new InputEvent("input"));
}

function initCustomButton(custom, inputs, onUncheck, onCheck) {
    function onInputCustom() {
        if (custom.checked) {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute("disabled");
                inputs[i].dispatchEvent(new InputEvent("input")); /* reclick auto */
            }
            onCheck();
        }
        else {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute("disabled", true);
            }
            onUncheck();
        }
    }

    custom.addEventListener("input", onInputCustom);

    custom.checked = false;
    custom.dispatchEvent(new InputEvent("input"));
}

function matchFont(element, context) {
    var style = getComputedStyle(element);
    var fontSize = style.fontSize.match(/(\d+(?:\.\d+)?)(\w+)/);
    context.font = rq * fontSize[1] + fontSize[2] + " " + style.fontFamily;
    context.fillStyle = style.color;
    context.textAlign = style.textAlign;
    context.textBaseline = "middle";
}

function initFileInput(file, update) {
    function onInputFile() {
        if (this.files.length > 0) {
            var fp = this.files[0];
            if (/image\//.test(fp.type)) {
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    update(this.result);
                });
                reader.readAsDataURL(fp);
                return;
            }
        }
        update("");
    }

    file.addEventListener("change", onInputFile);
    file.dispatchEvent(new InputEvent("change"));
}

function getDataID(code) {
    var file = document.getElementById(code + "-file");
    var fileCustom = document.getElementById(code + "-file-custom");
    var id = code;

    if (fileCustom.checked && file.files.length > 0) {
        id += "Upload";
    }
    else {
        id += "Default";
    }

    return id;
}

function dataLoop(imageData, f) { /* for ImageData objects */
    for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
            var i = 4 * (y * imageData.width + x);
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];
            f(i, r, g, b, a);
        }
    }
}

function applyGradient(imageData, gradientData) {
    var newData = new ImageData(imageData.width, imageData.height);
    var dataMin = 255;
    var dataMax = 0;

    dataLoop(imageData, function (i, r, g, b, a) { /* to maximize contrast */
        var intensity = Math.floor((r + g + b) / 3);
        dataMin = Math.min(dataMin, intensity - 1);
        dataMax = Math.max(dataMax, intensity + 1);
    });
    dataMin = Math.max(0, dataMin);
    dataMax = Math.min(255, dataMax);

    dataLoop(imageData, function (i, r, g, b, a) {
        var intensity = Math.floor(((r + g + b) / 3 - dataMin) * 255 / (dataMax - dataMin));
        newData.data[i] = gradientData.data[4 * intensity];
        newData.data[i + 1] = gradientData.data[4 * intensity + 1];
        newData.data[i + 2] = gradientData.data[4 * intensity + 2];
        newData.data[i + 3] = a;
    });

    return newData;
}

function initRecolorer(canvas, code, file, fileCustom, color0, color1, colorAuto, colorCustom) {
    var gradientCanvas = newCanvas(256, 1);
    var gradientContext = gradientCanvas.getContext("2d");
    var gradientData;
    var context = canvas.getContext("2d");

    function updateGradient(color0, color1) {
        var lg = gradientContext.createLinearGradient(0, 0, 256, 0);
        lg.addColorStop(1, color0.value);
        lg.addColorStop(0, color1.value);
        gradientContext.fillStyle = lg;
        gradientContext.fillRect(0, 0, 256, 1);
        gradientData = gradientContext.getImageData(0, 0, 256, 1);
        cardGradientData[code] = gradientData;
    }

    function updateCanvas() {
        var id = getDataID(code);

        if (!cardImageData[id]) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (colorCustom.checked) {
            context.putImageData(applyGradient(cardImageData[id], gradientData), 0, 0);
        }
        else {
            context.putImageData(cardImageData[id], 0, 0);
        }
    }

    function updateBackground(color0, color1) {
        updateGradient(color0, color1);
        updateCanvas();
    }

    function updateFile(dataURL) {
        newImage(dataURL).then(function (img) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            cardImageData[code + "Upload"] = context.getImageData(0, 0, canvas.width, canvas.height);
            cardImage[code + "Upload"] = img;
            updateCanvas();
        }).catch(function (img) {
            console.warn("Unable to load image.", img);
            updateCanvas();
        });
    }

    function onInputColorCustom() {
        updateBackground(color0, color1);
    }

    initFileInput(file, updateFile);
    initColorInput(color0, color1, colorAuto, false, 37, updateBackground);
    initCustomButton(fileCustom, [file], updateCanvas, updateCanvas);
    initCustomButton(colorCustom, [color0, color1, colorAuto], onInputColorCustom, onInputColorCustom);
}

function initRecolorers() {
    var bg = document.getElementById("card-bg");
    var bgFile = document.getElementById("bg-file");
    var bgFileCustom = document.getElementById("bg-file-custom");
    var bgColor0 = document.getElementById("bg-color-0");
    var bgColor1 = document.getElementById("bg-color-1");
    var bgColorAuto = document.getElementById("bg-color-auto");
    var bgColorCustom = document.getElementById("bg-color-custom");
    var swatches = document.getElementById("swatches").getElementsByTagName("input");

    function initCardData(canvas, id, url) {
        var code = id.slice(0, 2);
        newImage(url).then(function (img) {
            var canvasCopy = newCanvas(canvas.width, canvas.height);
            var context = canvasCopy.getContext("2d");
            context.drawImage(img, 0, 0, canvasCopy.width, canvasCopy.height);
            cardImageData[id] = context.getImageData(0, 0, canvasCopy.width, canvasCopy.height);
            cardImage[id] = img;
            cardCanvasUpdater[code]();
        });
    }

    function onInputSwatch() {
        var n = this.value.padStart(2, 0);
        if (bgFileCustom.checked) {
            bgFileCustom.click();
        }
        if (bgColorCustom.checked) {
            bgColorCustom.click();
        }
        initCardData(bg, "bgDefault", "img/bg/large/Background_" + n + ".jpg");
        initCardData(bg, "bgDefaultDragon", "img/bg/dragon/Background_" + n + ".jpg");
    }

    bg.width = pq * cardImageSize.bg.width;
    bg.height = pq * cardImageSize.bg.height;
    np.width = pq * cardImageSize.np.width;
    np.height = pq * cardImageSize.np.height;
    ib.width = pq * cardImageSize.ib.width;
    ib.height = pq * cardImageSize.ib.height;

    swatches[0].checked = true;
    for (var i = 0; i < swatches.length; i++) {
        swatches[i].addEventListener("input", onInputSwatch);
    }

    initCardData(bg, "bgDefault", "img/bg/large/Background_01.jpg");
    initCardData(bg, "bgDefaultDragon", "img/bg/dragon/Background_01.jpg");
    initCardData(np, "npDefault", "img/Nome.png");
    initCardData(np, "npDefaultDragon", "img/NomeDragon.png");
    initCardData(ib, "ibDefault", "img/Colonna.png");
    initCardData(ib, "ibDefaultArmor", "img/Armor.png");
    initCardData(ib, "ibDefaultAgon", "img/Agon.png");

    initRecolorer(bg, "bg", bgFile, bgFileCustom, bgColor0, bgColor1, bgColorAuto, bgColorCustom);
}

/* Card (mostly) */

function getMouse(e) {
    e.preventDefault();
    if (e.touches) {
        return {
            "x": e.touches[0].clientX,
            "y": e.touches[0].clientY
        };
    }
    return {
        "x": e.clientX,
        "y": e.clientY
    };
}

function initHandle() {
    var cardSize = document.getElementById("card-size");
    var handle = document.getElementById("handle");
    var cardRect = card.getBoundingClientRect();
    var style = document.createElement("style");

    function onHandleEnd(e) {
        style.remove();
        window.removeEventListener("mouseup", onHandleEnd);
        window.removeEventListener("mousemove", onHandle);
        window.removeEventListener("touchend", onHandleEnd);
        window.removeEventListener("touchmove", onHandle);
    }

    function onHandle(e) {
        e = getMouse(e);
        var n = (e.x - cardRect.left - m * 15) / 756; /* +m*15 for border */
        m = Math.max(0.5, Math.min(n, 1));

        card.style.transform = "scale(" + m + ")";
        card.style.marginRight = (m - 1) * 776 + "px"; /* +20 for border */
        card.style.marginBottom = (m - 1) * 1154 + "px"; /* +20 for border */
        cardSize.innerHTML = Math.round(200 * m) + "%";
    }

    function onHandleStart(e) {
        document.body.appendChild(style);
        window.addEventListener("mouseup", onHandleEnd);
        window.addEventListener("mousemove", onHandle);
        window.addEventListener("touchend", onHandleEnd);
        window.addEventListener("touchmove", onHandle);
    }

    style.innerHTML = "html {cursor: ew-resize;} body {pointer-events: none;} #card-size {display: initial;}";

    handle.addEventListener("mousedown", onHandleStart);
    handle.addEventListener("touchstart", onHandleStart);
}

function getScaledMouse(e) {
    e = getMouse(e);
    return {
        "x": e.x / m,
        "y": e.y / m
    };
}

function getScaledRect(element) {
    var rect = element.getBoundingClientRect();
    var scaled = {};
    for (var id in rect) {
        scaled[id] = rect[id] / m;
    }
    return scaled;
}

function initArt() {
    var artController = document.getElementById("card-art-controller");
    var circle = document.createElement("div");
    var style = document.createElement("style");
    var artFile = document.getElementById("art-file");
    var artPixel = document.getElementById("art-pixel");
    var artPosition = document.getElementById("art-position");
    var artWidth = document.getElementById("art-width");
    var artAngle = document.getElementById("art-angle");
    var artX = document.getElementById("art-x");
    var artY = document.getElementById("art-y");
    var artW = document.getElementById("art-w");
    var artA = document.getElementById("art-a");
    var mode, artRect0, artCenter, e0, x0, y0, w0, a0;

    function bound(input, n) {
        return Math.max(input.min, Math.min(n, input.max));
    }

    function updateBounds() {
        var artControllerRect = getScaledRect(artController);
        var artRect1 = getScaledRect(art);
        artX.min = Math.floor(-artRect1.width / 2);
        artX.max = Math.ceil(artControllerRect.width + artRect1.width / 2);
        artY.min = Math.floor(-artRect1.height / 2);
        artY.max = Math.ceil(artControllerRect.height + artRect1.height / 2);

        artX.dispatchEvent(new InputEvent("input"));
        artY.dispatchEvent(new InputEvent("input"));
    }

    function onInputArtFile(dataURL) {
        art.src = dataURL;
    }

    function onInputPixel() {
        if (artPixel.checked) {
            art.classList.add("pixel");
        }
        else {
            art.classList.remove("pixel");
        }
    }

    function onInputTransform() {
        mode = this.id.split("-")[1];
    }

    function onInputArtX() {
        this.value = bound(this, this.value);
        art.style.left = this.value + "px";
    }

    function onInputArtY() {
        this.value = bound(this, this.value);
        art.style.top = 1134 - this.value + "px";
    }

    function onInputArtW() {
        art.style.width = this.value + "px";
        updateBounds();
    }

    function onInputArtA() {
        this.value = Number(this.value).toFixed(3).replace(/\.?0+$/, "");
        art.style.transform = "translate(-50%, -50%) rotate(" + -this.value + "deg)";
        updateBounds();
    }

    function distance(p0, p1) {
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function angle(p0, p1) {
        var theta = Math.atan((p0.y - p1.y) / (p1.x - p0.x));
        return 180 * theta / Math.PI - 180 * (p1.x < p0.x);
    }

    function updateCircle(x, y, r, a) {
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        circle.style.width = 2 * r + "px";
        circle.style.height = 2 * r + "px";
        if (a) {
            circle.style.borderWidth = "1px 5px 1px 0";
            circle.style.transform = "translate(-50%, -50%) rotate(" + -a + "deg)";
        }
        else {
            circle.style.transform = "translate(-50%, -50%)";
        }
    }

    function onControlEnd(e) {
        circle.removeAttribute("style");
        circle.remove();
        style.remove();
        window.removeEventListener("mouseup", onControlEnd);
        window.removeEventListener("mousemove", onControl);
        window.removeEventListener("touchend", onControlEnd);
        window.removeEventListener("touchmove", onControl);
    }

    function onControl(e) {
        var e1 = getScaledMouse(e);
        if (mode == "position") {
            var dx = e1.x - e0.x;
            var dy = e1.y - e0.y;
            artX.value = Math.round(x0 + dx);
            artY.value = Math.round(y0 - dy);

            artX.dispatchEvent(new InputEvent("input"));
            artY.dispatchEvent(new InputEvent("input"));
            updateCircle(artX.value, 1134 - artY.value, 100);
        }
        else if (mode == "width") {
            var r0 = distance(artCenter, e0);
            var r1 = distance(artCenter, e1);
            var w1 = artRect0.width * r1 / r0;
            artW.value = Math.max(1, Math.round(w1));

            artW.dispatchEvent(new InputEvent("input"));
            updateCircle(x0, 1134 - y0, r1);
        }
        else if (mode == "angle") {
            var t0 = angle(artCenter, e0);
            var t1 = angle(artCenter, e1);
            var dt = t1 - t0;

            var min = Number(artA.min);
            var max = Number(artA.max);
            var dm = max - min;
            artA.value = ((a0 + dt - min) % dm + dm) % dm + min;

            artA.dispatchEvent(new InputEvent("input"));
            updateCircle(x0, 1134 - y0, 100, t1);
        }
    }

    function onControlStart(e) {
        e0 = getScaledMouse(e);
        x0 = Number(artX.value);
        y0 = Number(artY.value);
        w0 = Number(artW.value);
        a0 = Number(artA.value);

        var savedTransform = art.style.transform;
        art.style.transform = "";
        artRect0 = getScaledRect(art);
        art.style.transform = savedTransform;
        artCenter = {
            "x": Math.round((artRect0.left + artRect0.right) / 2),
            "y": Math.round((artRect0.top + artRect0.bottom) / 2)
        };
        updateBounds();

        updateCircle(x0, 1134 - y0, 0);
        artController.appendChild(circle);
        document.body.appendChild(style);
        window.addEventListener("mouseup", onControlEnd);
        window.addEventListener("mousemove", onControl);
        window.addEventListener("touchend", onControlEnd);
        window.addEventListener("touchmove", onControl);
    }

    updateBounds();
    circle.id = "circle";
    style.innerHTML = "html {cursor: move;} body {pointer-events: none;}";

    art.addEventListener("load", updateBounds);
    initFileInput(artFile, onInputArtFile);
    artPixel.addEventListener("input", onInputPixel);

    artPosition.addEventListener("input", onInputTransform);
    artWidth.addEventListener("input", onInputTransform);
    artAngle.addEventListener("input", onInputTransform);

    artX.addEventListener("input", onInputArtX);
    artY.addEventListener("input", onInputArtY);
    artW.addEventListener("input", onInputArtW);
    artA.addEventListener("input", onInputArtA);

    artController.addEventListener("mousedown", onControlStart);
    artController.addEventListener("touchstart", onControlStart);

    artPixel.checked = false;
    artPosition.checked = true;
    artPosition.dispatchEvent(new InputEvent("input"));
    artX.dispatchEvent(new InputEvent("input"));
    artY.dispatchEvent(new InputEvent("input"));
    artW.dispatchEvent(new InputEvent("input"));
    artA.dispatchEvent(new InputEvent("input"));
}

function initStats() {
    var stat = document.getElementById("info-stat");
    var statArmor = document.getElementById("info-stat-armor");

    function onOverStat(e) {
        if (e.target.classList.contains("bubble")) {
            var siblings = e.target.parentElement.children;
            for (var i = 0; i < siblings.length; i++) {
                siblings[i].classList.add("prospective");
                if (siblings[i] == e.target) {
                    break;
                }
            }
        }
    }

    function onOutStat(e) {
        if (e.target.classList.contains("bubble")) {
            var siblings = e.target.parentElement.children;
            for (var i = 0; i < siblings.length; i++) {
                siblings[i].classList.remove("prospective");
                if (siblings[i] == e.target) {
                    break;
                }
            }
        }
    }

    function onClickStat(e) {
        if (e.target.classList.contains("bubble")) {
            var check = !e.target.classList.contains("chosen");
            var siblings = e.target.parentElement.children;
            for (var i = 0; i < siblings.length; i++) {
                if (check) {
                    siblings[i].classList.add("checked");
                }
                else {
                    siblings[i].classList.remove("checked");
                }
                siblings[i].classList.remove("chosen");
                if (siblings[i] == e.target) {
                    if (check) {
                        siblings[i].classList.add("chosen");
                    }
                    check = false;
                }
            }
        }
    }

    function initStat(stat) {
        stat.addEventListener("mouseover", onOverStat);
        stat.addEventListener("mouseout", onOutStat);
        stat.addEventListener("click", onClickStat);
    }

    initStat(stat);
    initStat(statArmor);
}

function initTexts() {
    var pas = document.getElementsByClassName("move-pa");
    var bonuses = document.getElementsByClassName("move-bonus");

    function autoresize() {
        var context = newCanvas(0, 0).getContext("2d");
        var style = getComputedStyle(this);
        context.font = style.fontSize + " " + style.fontFamily;

        var placeholderSize = context.measureText(this.placeholder);
        var textSize = context.measureText(this.value);
        this.style.width = Math.max(placeholderSize.width, textSize.width) + "px";
    }

    for (var i = 0; i < pas.length; i++) {
        pas[i].addEventListener("input", autoresize);
    }
    for (var i = 0; i < bonuses.length; i++) {
        bonuses[i].addEventListener("input", autoresize);
    }
}

function initInfo() {
    initStats();
    initTexts();
}

/* Exporting */

function initRenderer() {
    var infobox = document.getElementById("card-info");
    var bubbles = infobox.getElementsByClassName("bubble");
    var inputs = infobox.getElementsByTagName("input");
    var icons = infobox.getElementsByTagName("img");

    var canvas = document.getElementById("card-canvas");
    var context = canvas.getContext("2d");
    var loading = document.getElementById("loading");

    function renderImage(img, element) {
        var style = getComputedStyle(element);
        context.drawImage(
            img,
            rq * parseFloat(style.left),
            rq * parseFloat(style.top),
            rq * parseFloat(style.width),
            rq * parseFloat(style.height)
        );
    }

    function renderBG(code, element) {
        var colorCustom = document.getElementById(code + "-color-custom");

        var id = getDataID(code);

        var subcanvas = newCanvas(rq * cardImageSize[code].width, rq * cardImageSize[code].height);
        var subcontext = subcanvas.getContext("2d");
        subcontext.drawImage(cardImage[id], 0, 0, subcanvas.width, subcanvas.height);

        if (colorCustom.checked) {
            var subdata = subcontext.getImageData(0, 0, subcanvas.width, subcanvas.height);
            var dyed = applyGradient(subdata, cardGradientData[code]);
            subcontext.putImageData(dyed, 0, 0);
        }

        return newImage(subcanvas.toDataURL());
    }

    function renderArt() {
        var pattern = /-?\d+(\.\d+)?(e-?\d+)?(px|%)?/g;
        var style = getComputedStyle(art);
        var matrix = style.transform.match(pattern) || [
            1, 0, 0,
            1, 0, 0
        ];
        var a = parseFloat(matrix[0]);
        var b = parseFloat(matrix[1]);
        var c = parseFloat(matrix[2]);
        var d = parseFloat(matrix[3]);
        var e = rq * parseFloat(matrix[4]);
        var f = rq * parseFloat(matrix[5]);
        var origin = style.transformOrigin.match(pattern) || [
            parseFloat(style.width) / 2,
            parseFloat(style.height) / 2
        ];
        var x0 = rq * (parseFloat(style.left) + parseFloat(origin[0]));
        var y0 = rq * (parseFloat(style.top) + parseFloat(origin[1]));

        context.save();
        if (style.imageRendering == "pixelated" || style.imageRendering == "crisp-edges") {
            context.imageSmoothingEnabled = false;
        }
        context.translate(x0, y0);
        context.transform(a, b, c, d, e, f);
        context.translate(-x0, -y0);
        renderImage(art, art);
        context.restore();
    }

    function renderName() {
        var cardName = document.getElementById("card-name");
        var color0 = document.getElementById("name-color-0");
        var color1 = document.getElementById("name-color-1");

        var style = getComputedStyle(cardName);
        var lg = context.createLinearGradient(
            0, rq * parseFloat(style.top),
            0, rq * (parseFloat(style.top) + parseFloat(style.height))
        );

        context.save();
        matchFont(cardName, context);
        lg.addColorStop(0, color0.value);
        lg.addColorStop(1, color1.value);
        context.fillStyle = lg;
        context.fillText(
            cardName.value,
            rq * (parseFloat(style.left) + parseFloat(style.width) / 2),
            rq * (parseFloat(style.top) + parseFloat(style.height) / 2)
        );
        context.restore();
    }

    function renderBubble(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        context.lineWidth = rq * 2;
        context.beginPath();
        context.arc(
            rq * (rect.left + rect.width / 2 - cardRect.left - 10),
            rq * (rect.top + rect.height / 2 - cardRect.top - 10),
            rq * (rect.width / 2 - 3),
            0,
            2 * Math.PI
        );
        if (element.classList.contains("checked")) {
            context.fill();
        }
        context.stroke();
        context.restore();
    }

    function renderText(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        matchFont(element, context);
        context.fillText(
            element.value,
            rq * (rect.left - cardRect.left - 10),
            rq * (rect.top + rect.height / 2 - cardRect.top - 10)
        );
        context.restore();
    }

    function renderIcon(img) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(img);

        context.drawImage(
            img,
            rq * (rect.left - cardRect.left - 10),
            rq * (rect.top - cardRect.top - 10),
            rq * rect.width,
            rq * rect.height
        );
    }

    renderCard = function () {
        loading.classList.remove("hidden");

        canvas.width = rq * 756;
        canvas.height = rq * 1134;

        return Promise.all([
            renderBG("bg"),
            renderBG("np"),
            renderBG("ib")
        ]).then(function (imgs) {
            renderImage(imgs[0], document.getElementById("card-bg"));
            renderArt();
            renderImage(imgs[1], document.getElementById("card-name-bg"));
            renderImage(imgs[2], document.getElementById("card-info-bg"));
            renderName();

            for (var i = 0; i < bubbles.length; i++) {
                renderBubble(bubbles[i]);
            }
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type == "text") {
                    renderText(inputs[i]);
                }
            }
            for (var i = 0; i < icons.length; i++) {
                renderIcon(icons[i]);
            }

            loading.classList.add("hidden");

            return canvas.toDataURL();
        });
    };
}

function initExport() {
    var exportPNG = document.getElementById("export-png");
    var exportPrint = document.getElementById("export-print");
    var renderPNG = document.getElementById("card-render");
    var renderPrint = document.getElementById("card-render-print");

    function getTimestamp() {
        return Date.now().toString(36);
    }

    function createPNG() {
        renderCard().then(function (url) {
            renderPNG.src = url;
            var a = document.createElement("a");
            a.href = url;
            a.setAttribute("download", "msrpg_" + getTimestamp() + ".png");
            a.click();
        });
    }

    function printOnce() {
        print();
        this.removeEventListener("load", printOnce);
        window.addEventListener("beforeprint", createPrint);
    }

    function createPrint(e) {
        renderCard().then(function (url) {
            renderPNG.src = url;
            if (e.type == "click") {
                renderPrint.addEventListener("load", printOnce);
                window.removeEventListener("beforeprint", createPrint);
            }
            renderPrint.src = url;
        });
    }

    initRenderer();

    exportPNG.addEventListener("click", createPNG);
    exportPrint.addEventListener("click", createPrint);
    window.addEventListener("beforeprint", createPrint);
}

function init() {
    var pqMatch = location.search.match(/[\?&]pq=(\d+(?:\.\d+)?)/);
    var rqMatch = location.search.match(/[\?&]rq=(\d+(?:\.\d+)?)/);
    if (pqMatch) {
        pq = Math.max(0.0625, Math.min(parseFloat(pqMatch[1]), 1));
    }
    if (rqMatch) {
        rq = Math.max(1, Math.min(parseFloat(rqMatch[1]), 4));
    }

    card = document.getElementById("card");
    art = document.getElementById("card-art");

    initRecolorers();
    initName();
    initHandle();
    initArt();
    initInfo();
    initExport();
}

function warn(e) {
    e.preventDefault();
    e.returnValue = "Changes you made may not be saved.";
    return e.returnValue;
}

window.addEventListener("load", init);
window.addEventListener("beforeunload", warn);
