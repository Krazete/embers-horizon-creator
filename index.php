<!DOCTYPE html>
<html>
<head>
    <link rel="shortcut icon" href="http://www.acchiappasogni.org/msrpg/wp-content/uploads/2014/09/Musha_Shugyo_Favicon.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="http://www.acchiappasogni.org/msrpg/wp-content/uploads/2014/09/Musha_Shugyo_touch.png">
    <link type="text/css" rel="stylesheet" href="index.css">
    <title>Musha Shugyo Creator</title>
    <script type="text/javascript" src="script/jscolor.js"></script>
    <script type="text/javascript" src="script/jsscrub.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="creator">
        <div id="types">
            <input id="type-dragon" type="radio" name="type" value="dragon">
            <label for="type-dragon">Dragon</label>
            <input id="type-char" type="radio" name="type" value="char">
            <label for="type-char">Character</label>
            <input id="type-armor" type="radio" name="type" value="armor">
            <label for="type-armor">Armor</label>
            <input id="type-agon" type="radio" name="type" value="agon">
            <label for="type-agon">Agon</label>
        </div>
        <div id="card" class="char">
            <canvas id="card-bg" width="756" height="1134"></canvas>
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
        <div id="symbols" class="hidden">
            <div id="stdsp">
                <div class="symbol"><img src="image/simboliSTD/SP/Combo.png"></div>
                <div class="symbol"><img src="image/simboliSTD/SP/Danni.png"></div>
                <div class="symbol"><img src="image/simboliSTD/SP/Difesa.png"></div>
                <div class="symbol"><img src="image/simboliSTD/SP/Ferite.png"></div>
                <div class="symbol"><img src="image/simboliSTD/SP/PA.png"></div>
            </div>
            <div id="drgtc">
                <div class="symbol"><img src="image/dragon/B_Allontana.png"></div>
                <div class="symbol"><img src="image/dragon/B_Cade.png"></div>
                <div class="symbol"><img src="image/dragon/B_ComboTC.png"></div>
                <div class="symbol"><img src="image/dragon/B_Distanza.png"></div>
                <div class="symbol"><img src="image/dragon/B_Possente.png"></div>
                <div class="symbol"><img src="image/dragon/B_Riflette.png"></div>
                <div class="symbol"><img src="image/dragon/B_SaltoOK.png"></div>
                <div class="symbol"><img src="image/dragon/B_Scaglia.png"></div>
                <div class="symbol"><img src="image/dragon/B_Schianta.png"></div>
                <div class="symbol"><img src="image/dragon/B_Trasla.png"></div>
                <div class="symbol"><img src="image/dragon/B_Ultra Durezza.png"></div>
                <div class="symbol"><img src="image/dragon/B_Ultra agility.png"></div>
            </div>
            <div id="stdtc">
                <div class="symbol"><img src="image/simboliSTD/TC/Allontana.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Cade.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Combo.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Distanza.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Possente.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Riflette.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/SaltoOK.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Scaglia.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Schianta.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Trasla.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Ultra Durezza.png"></div>
                <div class="symbol"><img src="image/simboliSTD/TC/Ultra agility.png"></div>
            </div>
            <div id="advtc">
                <div class="symbol"><img src="image/simboliADV/TC/Assorbimento.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Blitz2.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Cadi.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Conclusiva.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Congela.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Crawling 02.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Stordente.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/Tutto per tutto.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/danno continuato.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/dano_relativo.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/sforzo estremo.png"></div>
                <div class="symbol"><img src="image/simboliADV/TC/vampirico mini.png"></div>
            </div>
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
                (2:3) <a href="template/Background.png" download>Template</a>
            </div>

            <div class="menu-title">Name</div>
            <div class="row">
                <input id="name-color-custom" type="checkbox">
                <label for="name-color-custom">Custom</label>
                <input id="name-color-0" class="jscolor" data-jscolor="{hash: true}" value="#ffca1a">
                <input id="name-color-1" class="jscolor" data-jscolor="{hash: true}" value="#fe6207">
                <input id="name-color-auto" type="checkbox">
                <label for="name-color-auto">Auto</label>
            </div>

            <div class="menu-title">Nameplate</div>
            <div class="row">
                <input id="np-color-custom" type="checkbox">
                <label for="np-color-custom">Custom</label>
                <input id="np-color-0" class="jscolor" data-jscolor="{hash: true}" value="#ffffff">
                <input id="np-color-1" class="jscolor" data-jscolor="{hash: true}" value="#000000">
                <input id="np-color-auto" type="checkbox">
                <label for="np-color-auto">Auto</label>
            </div>
            <div class="row">
                <input id="np-file-custom" type="checkbox">
                <label for="np-file-custom">Custom</label>
                <input id="np-file" type="file" accept="image/*">
                (1:6) <a href="template/Nome.png" download>Template</a>
            </div>

            <div class="menu-title">Infobox</div>
            <div class="row">
                <input id="ib-color-custom" type="checkbox">
                <label for="ib-color-custom">Custom</label>
                <input id="ib-color-0" class="jscolor" data-jscolor="{hash: true}" value="#ffffff">
                <input id="ib-color-1" class="jscolor" data-jscolor="{hash: true}" value="#000000">
                <input id="ib-color-auto" type="checkbox">
                <label for="ib-color-auto">Auto</label>
            </div>
            <div class="row">
                <input id="ib-file-custom" type="checkbox">
                <label for="ib-file-custom">Custom</label>
                <input id="ib-file" type="file" accept="image/*">
                (4:9) <a id="ib-template" href="img/Colonna.png" download>Template</a>
            </div>
        </div>
        <div class="menu">
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
        <img id="logo" src="img/Logo Dragon Fighters Advanced Musha Shugyo.png">
    </div>
    <img id="card-render-print">
</body>
</html>
