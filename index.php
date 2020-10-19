<!DOCTYPE html>
<html>
<head>
    <link type="text/css" rel="stylesheet" href="index.css">
    <title>Embers Horizon Creator</title>
    <script type="text/javascript" src="script/jscolor.js"></script>
    <script type="text/javascript" src="script/jsscrub.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="creator">
        <div id="card">
            <div id="card-bg"></div>

            <img id="card-frame-left" src="img/leftFrame.png">
            <img id="card-setting" src="img/setting.png">
            <img id="card-gem" src="img/Gemme/gemma-01.png">
            <canvas id="card-gem-canvas" width="436" height="981"></canvas>
            <div id="card-art-controller">
                <img id="card-art">
            </div>
            <div id="card-icon-controller">
                <img id="card-icon">
            </div>

            <img id="card-page" src="img/rightPage.png">
            <img id="card-frame-right" src="img/rightFrame.png">
            <img id="card-logo" src="img/logo.png">

            <div id="card-info">
                <div>
                    <span>Nome Eroe</span>
                    <input type="text" placeholder="PLACEHOLDER">
                    <span>Giocatore</span>
                    <input type="text" disabled>
                </div>
                <div>
                    <span>Archetipo</span>
                    <input type="text" placeholder="PLACEHOLDER">
                    <div class="box"></div>
                    <input type="text" placeholder="PLACEHOLDER">
                    <div class="box"></div>
                    <input type="text" placeholder="PLACEHOLDER">
                    <div class="box"></div>
                </div>
                <div>
                    <span>Background</span>
                    <input type="text" placeholder="PLACEHOLDER">
                </div>
                <div>
                    <span>Mente</span>
                    <input type="text" disabled>
                    <div class="bubbleset">
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                    <span>Corpo</span>
                    <input type="text" disabled>
                    <div class="bubbleset">
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                    <span>Spirito</span>
                    <input type="text" disabled>
                    <div class="bubbleset">
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                </div>
                <div>
                    <img src="img/contentsDivider.png">
                </div>
                <div>
                    <span>MEMORIE</span>
                </div>
<?php for ($i = 0; $i < 3; $i++) { ?>
                <div>
<?php for ($j = 0; $j < 3; $j++) { ?>
                    <div>
                        <div class="box"></div>
                        <input class="text" placeholder="PLACEHOLDER">
                        <input class="text" disabled>
                    </div>
<?php } ?>
                </div>
<?php } ?>
                <div>
                    <span>NOTE</span>
                </div>
            </div>

            <div id="card-illustrator" class="card-credits">
                <span>Illustrazione by</span>
                <input type="text" placeholder="Nome">
            </div>
            <div id="card-origin" class="card-credits">
                <span>Personaggio tratto da:</span>
                <input type="text" placeholder="Origine">
            </div>

            <img id="tempo" src="img/areas.jpg">

            <div id="handle"></div>
        </div>

        <div id="card-size">40%</div>

        <div class="menu">
            <div class="menu-title">Background</div>
            <div id="swatches" class="row">
<?php for ($i = 1; $i < 7; $i++) { ?>
                <input id="swatch-<?php echo $i; ?>" type="radio" name="swatch" value="<?php echo $i; ?>">
                <label for="swatch-<?php echo $i; ?>">
                    <img src="img/Gemme/gemma-0<?php echo $i; ?>.png">
                </label>
<?php } ?>
            </div>
            <div class="row">
                <input id="bg-color-custom" type="checkbox">
                <label for="bg-color-custom">Custom</label>
                <input id="bg-color-0" class="jscolor" data-jscolor="{hash: true}" value="#c8c9c5">
                <input id="bg-color-1" class="jscolor" data-jscolor="{hash: true}" value="#000000">
                <input id="bg-color-auto" type="checkbox">
                <label for="bg-color-auto">Auto</label>
            </div>

            <div class="menu-title">Logo Art</div>
            <div class="row">
                <input id="art-file" type="file" accept="image/*">
                <input id="art-pixel" type="checkbox">
                <label for="art-pixel">Pixelated</label>
            </div>
            <div class="row">
                <input id="art-position" type="radio" name="art-transform">
                <label for="art-position">Position</label>
                X <input id="art-x" class="jsscrub" type="number" value="378" step="2">
                Y <input id="art-y" class="jsscrub" type="number" value="567" step="2">
            </div>
            <div class="row">
                <input id="art-width" type="radio" name="art-transform">
                <label for="art-width">Width</label>
                <input id="art-w" class="jsscrub" type="number" value="756" min="1" step="2"> px
            </div>
            <div class="row">
                <input id="art-angle" type="radio" name="art-transform">
                <label for="art-angle">Angle</label>
                <input id="art-a" class="jsscrub" data-jsscrub="continuous" type="number" value="0" min="-180" max="180"> °
            </div>

            <div class="menu-title">Card Art</div>
            <div class="row">
                <input id="art-file" type="file" accept="image/*">
                <input id="art-pixel" type="checkbox">
                <label for="art-pixel">Pixelated</label>
            </div>
            <div class="row">
                <input id="art-position" type="radio" name="art-transform">
                <label for="art-position">Position</label>
                X <input id="art-x" class="jsscrub" type="number" value="378" step="2">
                Y <input id="art-y" class="jsscrub" type="number" value="567" step="2">
            </div>
            <div class="row">
                <input id="art-width" type="radio" name="art-transform">
                <label for="art-width">Width</label>
                <input id="art-w" class="jsscrub" type="number" value="756" min="1" step="2"> px
            </div>
            <div class="row">
                <input id="art-angle" type="radio" name="art-transform">
                <label for="art-angle">Angle</label>
                <input id="art-a" class="jsscrub" data-jsscrub="continuous" type="number" value="0" min="-180" max="180"> °
            </div>

            <div class="menu-title">Export</div>
            <div class="row">
                <input id="export-png" type="button" value="PNG">
                <input id="export-print" type="button" value="Print">
            </div>
            <div id="loading" class="hidden">LOADING</div>
            <canvas id="card-canvas" class="hidden"></canvas>
            <img id="card-render">
        </div>
    </div>
    <img id="card-render-print">
</body>
</html>
