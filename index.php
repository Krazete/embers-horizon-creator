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
        <div id="card" class="char">
            <canvas id="card-bg" width="1134" height="756"></canvas>
            <div id="card-art-controller">
                <img id="card-art">
            </div>
            <canvas id="card-name-bg" width="720" height="120"></canvas>
            <input id="card-name" type="text" placeholder="Card Name" autocomplete="off" spellcheck="false">
            <canvas id="card-name-canvas"></canvas>
            <canvas id="card-info-bg" width="436" height="981"></canvas>
            <div id="card-info">
                <input id="info-type" type="text" placeholder="Type">
                <div id="info-stat">
<?php foreach (array("ra", "at", "de", "vo", "eq") as $id) { ?>
                    <div id="<?php echo $id; ?>">
<?php for ($i = 0; $i < 6; $i++) { ?>
                        <div class="bubble"></div>
<?php } ?>
                    </div>
<?php } ?>
                </div>
                <div id="info-sp" class="move-icons"></div>
                <div id="info-stat-armor">
<?php foreach (array("st", "da") as $id) { ?>
                    <div id="<?php echo $id; ?>">
<?php for ($i = 0; $i < 7; $i++) { ?>
                        <div class="bubble"></div>
<?php } ?>
                    </div>
<?php } ?>
                </div>
                <div id="info-moves">
<?php for ($i = 0; $i < 8; $i++) { ?>
                    <div id="move-<?php echo $i; ?>">
                        <input class="move-name" type="text" placeholder="Skill Name" autocomplete="off" spellcheck="false">
                        <input class="move-pa" type="text" placeholder="PA" autocomplete="off" spellcheck="false">
                        <div class="move-icons"></div>
                        <input class="move-bonus" type="text" placeholder="Bonus" autocomplete="off" spellcheck="false">
                    </div>
<?php } ?>
                </div>
            </div>
            <div id="handle"></div>
        </div>
        <div id="card-size">200%</div>
        <div class="menu">
            <div class="menu-title">Background</div>
            <div id="swatches" class="row">
<?php for ($i = 1; $i < 11; $i++) { ?>
                <input id="swatch-<?php echo $i; ?>" type="radio" name="swatch" value="<?php echo $i; ?>">
                <label for="swatch-<?php echo $i; ?>"></label>
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
            <div class="row">
                <input id="bg-file-custom" type="checkbox">
                <label for="bg-file-custom">Custom</label>
                <input id="bg-file" type="file" accept="image/*">
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
