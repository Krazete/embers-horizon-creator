var card, gemImage, gemGradientData, gemImageData, renderCard;
var m = 0.45; /* magnification */

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

function matchFont(element, context) {
    var style = getComputedStyle(element);
    var fontSize = style.fontSize.match(/(\d+(?:\.\d+)?)(\w+)/);
    context.font = fontSize[1] + fontSize[2] + " " + style.fontFamily;
    context.fillStyle = style.color;
    context.textAlign = style.textAlign;
    context.textBaseline = "middle";
    return style;
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

function initGemRecolorer() {
    var canvas = document.getElementById("card-gem");
    var context = canvas.getContext("2d");
    var gradientCanvas = newCanvas(256, 1);
    var gradientContext = gradientCanvas.getContext("2d");
    var color0 = document.getElementById("gem-color-0");
    var color1 = document.getElementById("gem-color-1");
    var colorAuto = document.getElementById("gem-color-auto");
    var colorCustom = document.getElementById("gem-color-custom");
    var swatches = document.getElementById("swatches").getElementsByTagName("input");

    function updateCanvas() {
        if (gemImageData) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (colorCustom.checked) {
                context.putImageData(applyGradient(gemImageData, gemGradientData), 0, 0);
            }
            else {
                context.putImageData(gemImageData, 0, 0);
            }
        }
    }

    function updateGemImage(url) {
        newImage(url).then(function (img) {
            var canvasCopy = newCanvas(canvas.width, canvas.height);
            var context = canvasCopy.getContext("2d");
            context.drawImage(img, 0, 0, canvasCopy.width, canvasCopy.height);
            gemImageData = context.getImageData(0, 0, canvasCopy.width, canvasCopy.height);
            gemImage = img;
            updateCanvas();
        });
    }

    function updateGradient(color0, color1) {
        var lg = gradientContext.createLinearGradient(0, 0, 256, 0);
        lg.addColorStop(1, "white");
        lg.addColorStop(0.75, color0.value);
        lg.addColorStop(0, color1.value);
        gradientContext.fillStyle = lg;
        gradientContext.fillRect(0, 0, 256, 1);
        gemGradientData = gradientContext.getImageData(0, 0, 256, 1);
    }

    function onInputCustom() {
        if (colorCustom.checked) {
            color0.removeAttribute("disabled");
            color1.removeAttribute("disabled");
            colorAuto.removeAttribute("disabled");
            colorAuto.dispatchEvent(new InputEvent("input"));
        }
        else {
            color0.setAttribute("disabled", true);
            color1.setAttribute("disabled", true);
            colorAuto.setAttribute("disabled", true);
        }
        updateCanvas();
    }

    function onInputSwatch() {
        if (colorCustom.checked) {
            colorCustom.click();
        }
        updateGemImage("img/Gemme/gemma-0" + this.value + ".png");
    }

    function onColorInput(color0, color1) {
        updateGradient(color0, color1);
        updateCanvas();
    }

    swatches[0].checked = true;
    for (var i = 0; i < swatches.length; i++) {
        swatches[i].addEventListener("input", onInputSwatch);
    }

    updateGemImage("img/Gemme/gemma-01.png");

    colorCustom.addEventListener("input", onInputCustom);

    colorCustom.checked = false;
    colorCustom.dispatchEvent(new InputEvent("input"));

    initColorInput(color0, color1, colorAuto, true, 10, onColorInput);
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
    var mMax = 0.5;

    function resizeCard(n) {
        m = Math.max(0.2, Math.min(n, mMax));
        card.style.transform = "scale(" + m + ")";
        card.style.marginRight = (m - 1) * 2500 + "px"; /* +20 for border */
        card.style.marginBottom = (m - 1) * 1792 + "px"; /* +20 for border */
        cardSize.innerHTML = Math.round(100 * m) + "%";
    }

    function onHandleEnd(e) {
        style.remove();
        window.removeEventListener("mouseup", onHandleEnd);
        window.removeEventListener("mousemove", onHandle);
        window.removeEventListener("touchend", onHandleEnd);
        window.removeEventListener("touchmove", onHandle);
    }

    function onHandle(e) {
        e = getMouse(e);
        var n = (e.x - cardRect.left - m * 15) / 2480; /* +m*15 for border */
        resizeCard(n);
    }

    function onHandleStart(e) {
        document.body.appendChild(style);
        window.addEventListener("mouseup", onHandleEnd);
        window.addEventListener("mousemove", onHandle);
        window.addEventListener("touchend", onHandleEnd);
        window.addEventListener("touchmove", onHandle);
    }

    function onResize() {
        var newmMax = Math.max(0.5, Math.min((innerWidth - 40) / 2480, 1));
        if (mMax != newmMax) {
            mMax = newmMax;
            resizeCard(m);
        }
    }

    style.innerHTML = "html {cursor: ew-resize;} body {pointer-events: none;} #card-size {display: initial;}";

    handle.addEventListener("mousedown", onHandleStart);
    handle.addEventListener("touchstart", onHandleStart);
    window.addEventListener("resize", onResize);
    onResize();
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

function initArt(code) {
    var artController = document.getElementById("card-" + code + "-controller");
    var art = document.getElementById("card-" + code);
    var circle = document.createElement("div");
    var style = document.createElement("style");
    var artFile = document.getElementById(code + "-file");
    var artPixel = document.getElementById(code + "-pixel");
    var artPosition = document.getElementById(code + "-position");
    var artWidth = document.getElementById(code + "-width");
    var artAngle = document.getElementById(code + "-angle");
    var artX = document.getElementById(code + "-x");
    var artY = document.getElementById(code + "-y");
    var artW = document.getElementById(code + "-w");
    var artA = document.getElementById(code + "-a");
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
        art.style.top = artController.offsetHeight - this.value + "px";
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
        artController.classList.remove("active");
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
            updateCircle(artX.value, artController.offsetHeight - artY.value, 100);
        }
        else if (mode == "width") {
            var r0 = distance(artCenter, e0);
            var r1 = distance(artCenter, e1);
            var w1 = artRect0.width * r1 / r0;
            artW.value = Math.max(1, Math.round(w1));

            artW.dispatchEvent(new InputEvent("input"));
            updateCircle(x0, artController.offsetHeight - y0, r1);
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
            updateCircle(x0, artController.offsetHeight - y0, 100, t1);
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

        updateCircle(x0, artController.offsetHeight - y0, 0);
        artController.classList.add("active");
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

function initArts() {
    initArt("icon");
    initArt("hero");
}

function initTexts() {
    var cardIllustratorInput = document.getElementById("card-illustrator-input");
    var cardOriginInput = document.getElementById("card-origin-input");
    var cardInfo = document.getElementById("card-info");
    var inputs = cardInfo.getElementsByTagName("input");
    var textareas = cardInfo.getElementsByTagName("textarea");
    var textRuler = newCanvas(0, 0).getContext("2d");

    function getTextMetrics(input) {
        var style = getComputedStyle(input);
        textRuler.font = style.fontSize + " " + style.fontFamily;
        return textRuler.measureText(input.value);
    }

    function autoresize() {
        var textSize = getTextMetrics(this);
        this.style.width = Math.max(20, Math.min(textSize.width, 2000)) + "px";
    }

    function autofit() {
        var rect = getScaledRect(this);
        for (var i = 50; i > 0; i--) {
            this.style.fontSize = i + "px";
            var textSize = getTextMetrics(this);
            if (textSize.width < rect.width) {
                break;
            }
        }
    }

    function sanitize() {
        if (this.value.search(/\n|\s\s/) >= 0) {
            this.value = this.value.replace(/\n/g, "");
            this.value = this.value.replace(/\s+/g, " ");
        }
    }

    function autopad() {
        var rect = getScaledRect(this);
        var textSize = getTextMetrics(this);
        if (textSize.width < rect.width) {
            this.value = "\n" + this.value.trim();
        }
    }

    function autoscroll() {
        if (document.activeElement != this) {
            this.scrollTo(0, this.scrollHeight);
        }
    }

    cardIllustratorInput.addEventListener("input", autoresize);
    if (cardIllustratorInput.value) {
        cardIllustratorInput.dispatchEvent(new InputEvent("input"));
    }
    cardOriginInput.addEventListener("input", autoresize);
    if (cardOriginInput.value) {
        cardOriginInput.dispatchEvent(new InputEvent("input"));
    }
    for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].disabled) {
            inputs[i].addEventListener("input", autofit);
            if (inputs[i].value) {
                inputs[i].dispatchEvent(new InputEvent("input"));
            }
        }
    }
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].addEventListener("focus", sanitize); /* revert autopad */
        textareas[i].addEventListener("input", sanitize);
        textareas[i].addEventListener("change", autopad);
        textareas[i].addEventListener("blur", autopad); /* revert reversion of autopad */
        textareas[i].addEventListener("blur", autoscroll);
        textareas[i].addEventListener("scroll", autoscroll);
        if (textareas[i].value) {
            textareas[i].dispatchEvent(new InputEvent("input"));
            textareas[i].dispatchEvent(new InputEvent("blur"));
        }
    }
}

function initStats() {
    var mcs = document.getElementById("mente-corpo-spirito");
    var stats = mcs.getElementsByClassName("bubbleset");

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

    for (var i = 0; i < stats.length; i++) {
        initStat(stats[i]);
    }
}

/* Exporting */

function initRenderer() {
    var canvas = document.getElementById("card-canvas");
    var context = canvas.getContext("2d");
    var loading = document.getElementById("loading");

    function renderGem() {
        var subcanvas = newCanvas(gemImage.width, gemImage.height);
        var subcontext = subcanvas.getContext("2d");
        subcontext.drawImage(gemImage, 0, 0, subcanvas.width, subcanvas.height);

        var colorCustom = document.getElementById("gem-color-custom");
        if (colorCustom.checked) {
            var subdata = subcontext.getImageData(0, 0, subcanvas.width, subcanvas.height);
            var dyed = applyGradient(subdata, gemGradientData);
            subcontext.putImageData(dyed, 0, 0);
        }

        return newImage(subcanvas.toDataURL());
    }

    function renderImage(img, element) {
        var style = getComputedStyle(element ? element : img);
        context.drawImage(
            img,
            parseFloat(style.left),
            parseFloat(style.top),
            parseFloat(style.width),
            parseFloat(style.height)
        );
    }

    function renderArt(art) {
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
        var e = parseFloat(matrix[4]);
        var f = parseFloat(matrix[5]);
        var origin = style.transformOrigin.match(pattern) || [
            parseFloat(style.width) / 2,
            parseFloat(style.height) / 2
        ];
        var x0 = (parseFloat(style.left) + parseFloat(origin[0]));
        var y0 = (parseFloat(style.top) + parseFloat(origin[1]));

        context.save();
        if (style.imageRendering == "pixelated" || style.imageRendering == "crisp-edges") {
            context.imageSmoothingEnabled = false;
        }
        context.translate(x0, y0);
        context.transform(a, b, c, d, e, f);
        context.translate(-x0, -y0);
        renderImage(art);
        context.restore();
    }

    function renderInfoImage(img) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(img);

        context.drawImage(
            img,
            rect.left - cardRect.left - 10,
            rect.top - cardRect.top - 10,
            rect.width,
            rect.height
        );
    }

    function renderSqubble(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(
            rect.left + 12 - cardRect.left - 10,
            rect.top - cardRect.top - 10
        );
        context.lineTo(
            rect.left + rect.width - 12 - cardRect.left - 10,
            rect.top - cardRect.top - 10
        );
        context.arc(
            rect.left + rect.width - 12 - cardRect.left - 10,
            rect.top + 12 - cardRect.top - 10,
            12,
            Math.PI * 3 / 2,
            0
        );
        context.lineTo(
            rect.left + rect.width - cardRect.left - 10,
            rect.top + rect.height - 12 - cardRect.top - 10
        );
        context.arc(
            rect.left + rect.width - 12 - cardRect.left - 10,
            rect.top + rect.height - 12 - cardRect.top - 10,
            12,
            0,
            Math.PI / 2
        );
        context.lineTo(
            rect.left + 12 - cardRect.left - 10,
            rect.top + rect.height - cardRect.top - 10
        );
        context.arc(
            rect.left + 12 - cardRect.left - 10,
            rect.top + rect.height - 12 - cardRect.top - 10,
            12,
            Math.PI / 2,
            Math.PI
        );
        context.lineTo(
            rect.left - cardRect.left - 10,
            rect.top + 12 - cardRect.top - 10
        );
        context.arc(
            rect.left + 12 - cardRect.left - 10,
            rect.top + 12 - cardRect.top - 10,
            12,
            Math.PI,
            Math.PI * 3 / 2
        );
        context.stroke();
        context.restore();
    }

    function renderBubble(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        context.lineWidth = 4;
        context.beginPath();
        context.arc(
            rect.left + rect.width / 2 - cardRect.left - 10,
            rect.top + rect.height / 2 - cardRect.top - 10,
            rect.width / 2 - 2,
            0,
            2 * Math.PI
        );
        if (element.classList.contains("checked")) {
            context.fill();
        }
        context.stroke();
        context.restore();
    }

    function renderUnderline(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(
            rect.left - cardRect.left - 10,
            rect.top + rect.height - 30 - cardRect.top - 10
        );
        context.lineTo(
            rect.left + rect.width - cardRect.left - 10,
            rect.top + rect.height - 30 - cardRect.top - 10
        );
        context.stroke();
        context.restore();
    }

    function renderText(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        var style = matchFont(element, context);
        context.fillText(
            element.tagName == "INPUT" ? element.value : element.innerHTML,
            rect.left + rect.width * (
                style.textAlign == "right" ? 1 : style.textAlign == "center" ? 0.5 : 0
            ) - cardRect.left - 10,
            rect.top + rect.height / 2 - cardRect.top - 10
        );
        context.restore();
    }

    function renderTextArea(element) {
        var cardRect = getScaledRect(card);
        var rect = getScaledRect(element);

        context.save();
        var style = matchFont(element, context);

        var substrings = [];
        var value = element.value.trim();
        for (var i = 0; i < value.length; i++) {
            var subvalue = value.slice(i);
            var textRuler = context.measureText(subvalue);
            if (textRuler.width < rect.width) {
                var k = 0;
                if (i != 0 && value[i - 1].search(/\s/) < 0) {
                    k = subvalue.search(/\s/);
                }
                substrings.push(value.slice(i + k).trim());
                value = value.slice(0, i + k).trim();
                i = -1;
            }
        }
        for (var i = 0; i < Math.min(substrings.length, 2); i++) { /* maximum of 2 lines */
            context.fillText(
                substrings[i],
                rect.left - cardRect.left - 10,
                rect.top + rect.height / 2 + 25 - 50 * i - cardRect.top - 10
            );
        }

        context.restore();
    }

    function renderInfo() {
        var infobox = document.getElementById("card-info");
        var squbbles = infobox.getElementsByClassName("squbble");
        var bubbles = infobox.getElementsByClassName("bubble");
        var lines = infobox.getElementsByClassName("underlined");
        var spans = infobox.getElementsByTagName("span");
        var inputs = infobox.getElementsByTagName("input");
        var textareas = infobox.getElementsByTagName("textarea");
        var cardIllustrator = document.getElementById("card-illustrator");
        var cardIllustratorSpan = cardIllustrator.getElementsByTagName("span")[0];
        var cardIllustratorInput = document.getElementById("card-illustrator-input");
        var cardOrigin = document.getElementById("card-origin");
        var cardOriginSpan = cardOrigin.getElementsByTagName("span")[0];
        var cardOriginInput = document.getElementById("card-origin-input");

        renderInfoImage(document.getElementById("contents-divider"));
        for (var i = 0; i < squbbles.length; i++) {
            renderSqubble(squbbles[i]);
        }
        for (var i = 0; i < bubbles.length; i++) {
            renderBubble(bubbles[i]);
        }
        for (var i = 0; i < lines.length; i++) {
            renderUnderline(lines[i]);
        }
        for (var i = 0; i < spans.length; i++) {
            renderText(spans[i]);
        }
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "text") {
                renderText(inputs[i]);
            }
        }
        for (var i = 0; i < textareas.length; i++) {
            renderTextArea(textareas[i]);
        }
        renderText(cardIllustratorSpan);
        renderText(cardIllustratorInput);
        renderText(cardOriginSpan);
        renderText(cardOriginInput);
    }

    renderCard = function () {
        loading.classList.remove("hidden");

        canvas.width = 2480;
        canvas.height = 1772;

        return renderGem().then(function (gem) {
            renderImage(document.getElementById("card-back"));
            renderImage(document.getElementById("card-frame-left"));
            renderArt(document.getElementById("card-hero"));
            renderImage(document.getElementById("card-setting"));
            renderImage(gem, document.getElementById("card-gem"));
            renderArt(document.getElementById("card-icon"));
            renderImage(document.getElementById("card-page"));
            renderImage(document.getElementById("card-frame-right"));
            renderImage(document.getElementById("card-logo"));
            renderInfo();

            loading.classList.add("hidden");

            return canvas.toDataURL();
        });
    };
}

function initExport() {
    var exportPNG = document.getElementById("export-png");
    var renderPNG = document.getElementById("card-render");

    function getTimestamp() {
        return Date.now().toString(36);
    }

    function createPNG() {
        renderCard().then(function (url) {
            renderPNG.src = url;
            var a = document.createElement("a");
            a.href = url;
            a.setAttribute("download", "embers-horizon-" + getTimestamp() + ".png");
            a.click();
        });
    }

    initRenderer();

    exportPNG.addEventListener("click", createPNG);
}

function init() {
    card = document.getElementById("card");
    initGemRecolorer();
    initHandle();
    initArts();
    initTexts();
    initStats();
    initExport();
}

function warn(e) {
    e.preventDefault();
    e.returnValue = "Changes you made may not be saved.";
    return e.returnValue;
}

window.addEventListener("load", init);
window.addEventListener("beforeunload", warn);
