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
    <div id="card">
        <!-- <div id="card-bg"></div> -->
        <img id="card-back" src="img/back.png">

        <img id="card-frame-left" src="img/leftFrame.png">
        <div id="card-hero-controller">
            <img id="card-hero">
        </div>
        <img id="card-setting" src="img/setting.png">
        <canvas id="card-gem" width="176" height="178"></canvas>
        <div id="card-icon-controller">
            <img id="card-icon">
        </div>

        <img id="card-page" src="img/rightPage.png">
        <img id="card-frame-right" src="img/rightFrame.png">
        <img id="card-logo" src="img/logo.png">

        <div id="card-info">
            <div>
                <span>Nome Eroe</span>
                <div class="underlined">
                    <input id="nome-eroe" type="text">
                </div>
                <span>Giocatore</span>
                <div class="underlined">
                    <input id="giocatore" type="text" disabled>
                </div>
            </div>
            <div id="archetipo">
                <span>Archetipo</span>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="squbble"></div>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="squbble"></div>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="squbble"></div>
            </div>
            <div>
                <span>Background</span>
                <div class="underlined">
                    <input id="background" type="text">
                </div>
            </div>
            <div id="mente-corpo-spirito">
                <span>Mente</span>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="bubbleset">
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                </div>
                <span>Corpo</span>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="bubbleset">
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                </div>
                <span>Spirito</span>
                <div class="underlined">
                    <input type="text">
                </div>
                <div class="bubbleset">
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                    <div class="bubble"></div>
                </div>
            </div>
            <div class="centered">
                <img id="contents-divider" src="img/contentsDivider.png">
            </div>
            <div class="centered">
                <span>MEMORIE</span>
            </div>
<?php for ($i = 0; $i < 3; $i++) { ?>
            <div>
<?php for ($j = 0; $j < 3; $j++) { ?>
                <div class="memorie-row">
                    <div class="squbble"></div>
                    <div class="underlined">
                        <textarea class="memorie-text"></textarea>
                    </div>
                    <div class="underlined">
                        <input class="memorie-text-disabled" type="text" disabled>
                    </div>
                </div>
<?php } ?>
            </div>
<?php } ?>
            <div class="centered">
                <span>NOTE</span>
            </div>
        </div>

        <div id="card-illustrator" class="card-credits">
            <span>Illustrazione by</span>
            <input id="card-illustrator-input" type="text" placeholder="Nome">
        </div>
        <div id="card-origin" class="card-credits">
            <span>Personaggio tratto da:</span>
            <input id="card-origin-input" type="text" placeholder="Origine">
        </div>

        <div id="handle"></div>
    </div>

    <div id="card-size">40%</div>

    <div id="menu">
        <div class="menu-title">Gemma</div>
        <div id="swatches" class="row">
<?php for ($i = 1; $i < 7; $i++) { ?>
            <input id="swatch-<?php echo $i; ?>" type="radio" name="swatch" value="<?php echo $i; ?>">
            <label for="swatch-<?php echo $i; ?>"></label>
<?php } ?>
        </div>
        <div class="row">
            <input id="gem-color-custom" type="checkbox">
            <label for="gem-color-custom">Custom</label>
            <input id="gem-color-0" class="jscolor" data-jscolor="{hash: true}" value="#c8c9c5">
            <input id="gem-color-1" class="jscolor" data-jscolor="{hash: true}" value="#000000">
            <input id="gem-color-auto" type="checkbox">
            <label for="gem-color-auto">Auto</label>
        </div>

        <div class="menu-title">Immagine Icona</div>
        <div class="row">
            <input id="icon-file" type="file" accept="image/*">
            <input id="icon-pixel" type="checkbox">
            <label for="icon-pixel">Pixelated</label>
        </div>
        <div class="row">
            <input id="icon-position" type="radio" name="icon-transform">
            <label for="icon-position">Posizione</label>
            X <input id="icon-x" class="jsscrub" type="number" value="150" step="2">
            Y <input id="icon-y" class="jsscrub" type="number" value="145" step="2">
        </div>
        <div class="row">
            <input id="icon-width" type="radio" name="icon-transform">
            <label for="icon-width">Larghezza</label>
            <input id="icon-w" class="jsscrub" type="number" value="200" min="1" step="2"> px
        </div>
        <div class="row">
            <input id="icon-angle" type="radio" name="icon-transform">
            <label for="icon-angle">Angolo</label>
            <input id="icon-a" class="jsscrub" data-jsscrub="continuous" type="number" value="0" min="-180" max="180"> °
        </div>

        <div class="menu-title">Immagine Eroe</div>
        <div class="row">
            <input id="hero-file" type="file" accept="image/*">
            <input id="hero-pixel" type="checkbox">
            <label for="hero-pixel">Pixelated</label>
        </div>
        <div class="row">
            <input id="hero-position" type="radio" name="hero-transform">
            <label for="hero-position">Posizione</label>
            X <input id="hero-x" class="jsscrub" type="number" value="566" step="2">
            Y <input id="hero-y" class="jsscrub" type="number" value="886" step="2">
        </div>
        <div class="row">
            <input id="hero-width" type="radio" name="hero-transform">
            <label for="hero-width">Larghezza</label>
            <input id="hero-w" class="jsscrub" type="number" value="1132" min="1" step="2"> px
        </div>
        <div class="row">
            <input id="hero-angle" type="radio" name="hero-transform">
            <label for="hero-angle">Angolo</label>
            <input id="hero-a" class="jsscrub" data-jsscrub="continuous" type="number" value="0" min="-180" max="180"> °
        </div>

        <div class="row">
            <input id="export-png" class="menu-title" type="button" value="Esporta PNG">
        </div>

        <div id="loading" class="hidden">LOADING</div>
        <canvas id="card-canvas" class=""></canvas>
        <img id="card-render">
    </div>
</body>
</html>
