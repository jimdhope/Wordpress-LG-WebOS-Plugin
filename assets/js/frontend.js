(function(){
    // --- Constants and State ---
    var KEY = { LEFT:37, UP:38, RIGHT:39, DOWN:40, ENTER:13, RED:49, GREEN:50, YELLOW:51, BLUE:52 };
    var FOCUSED_CLASS = 'lg-webos-focused';
    var actionBlocks = []; // Holds configured remote-actions blocks

    /**
     * Initializes all LG webOS blocks on the page once the DOM is ready.
     */
    function initBlocks() {
        // --- Initialize Remote Actions Blocks ---
        document.querySelectorAll('.lgwebos-remote-actions[data-lgwebos]').forEach(function(el) {
            try {
                var config = JSON.parse(el.getAttribute('data-lgwebos') || '{}');
                var panels = document.querySelectorAll('.lgwebos-panel');

                if (panels.length === 0) return;

                var currentIndex = parseInt(config.startIndex, 10) || 0;
                if (currentIndex < 0 || currentIndex >= panels.length) {
                    currentIndex = 0;
                }

                actionBlocks.push({
                    el: el,
                    panels: panels,
                    currentIndex: currentIndex,
                    listenKeys: (config.listenKeys || '').split(',').map(function(k) { return k.trim(); })
                });

                // Set initial focus class on the starting panel
                if (panels[currentIndex]) {
                    panels[currentIndex].classList.add(FOCUSED_CLASS);
                }

            } catch (e) {
                console.error('LG webOS: Error initializing remote-actions block.', e);
            }
        });
    }

    /**
     * Handles `lgwebos:color` events, triggered by the keydown shim or webOS environment.
     */
    document.addEventListener('lgwebos:color', function(e){
        var color = e.detail.color;

        // --- Handle Menus ---
        document.querySelectorAll('[data-lgwebos-menu]').forEach(function(menu){
            try { var cfg = JSON.parse(menu.getAttribute('data-lgwebos-menu')||'{}'); if(cfg.colorKey===color){ menu.classList.toggle('open'); } } catch(err){}
        });

        // --- Handle Toggles ---
        document.querySelectorAll('.lgwebos-panel[data-color-key]').forEach(function(panel){
            if(panel.dataset.colorKey === color){
                panel.classList.toggle('hidden');
            }
        });

        // --- Handle Remote Actions ---
        for (var i = 0; i < actionBlocks.length; i++) {
            var block = actionBlocks[i];
            if (block.listenKeys.indexOf('color') !== -1) {
                var panelIndex = -1;
                for (var j = 0; j < block.panels.length; j++) {
                    if (block.panels[j].dataset.colorKey === color) {
                        panelIndex = j;
                        break;
                    }
                }

                if (panelIndex !== -1) {
                    if (block.panels[block.currentIndex]) {
                        block.panels[block.currentIndex].classList.remove(FOCUSED_CLASS);
                    }
                    block.currentIndex = panelIndex;
                    if (block.panels[block.currentIndex]) {
                        block.panels[block.currentIndex].classList.add(FOCUSED_CLASS);
                        block.panels[block.currentIndex].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
    });

    /**
     * Global keydown handler for remote control simulation and navigation.
     */
    document.addEventListener('keydown', function(e){
        // 1. Shim for color keys (1, 2, 3, 4)
        var keyColorMap = { 49: 'red', 50: 'green', 51: 'yellow', 52: 'blue' };
        var color = keyColorMap[e.keyCode];
        if (color) {
            document.dispatchEvent(new CustomEvent('lgwebos:color', { detail: { color: color } }));
            e.preventDefault();
            return; // It's a color key, so we're done.
        }

        // 2. Navigation and actions for `remote-actions` blocks
        var handled = false;
        for (var i = 0; i < actionBlocks.length; i++) {
            var block = actionBlocks[i];
            var newIndex = block.currentIndex;

            // Handle Arrow Keys
            if (block.listenKeys.indexOf('arrows') !== -1 && (e.keyCode >= 37 && e.keyCode <= 40)) {
                if (block.panels[block.currentIndex]) {
                    block.panels[block.currentIndex].classList.remove(FOCUSED_CLASS);
                }
                if (e.keyCode === KEY.LEFT || e.keyCode === KEY.UP) newIndex--;
                if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.DOWN) newIndex++;

                // Wrap index
                if (newIndex < 0) newIndex = block.panels.length - 1;
                else if (newIndex >= block.panels.length) newIndex = 0;
                block.currentIndex = newIndex;

                if (block.panels[block.currentIndex]) {
                    block.panels[block.currentIndex].classList.add(FOCUSED_CLASS);
                    block.panels[block.currentIndex].scrollIntoView({ behavior: 'smooth' });
                }
                handled = true;
            }

            // Handle Enter Key
            if (block.listenKeys.indexOf('enter') !== -1 && e.keyCode === KEY.ENTER) {
                if (block.panels[block.currentIndex]) {
                    block.panels[block.currentIndex].click();
                }
                handled = true;
            }

            if (handled) break; // Stop after the first block handles the event
        }

        if (handled) e.preventDefault();
    });

    // --- Run Initialization ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlocks);
    } else {
        initBlocks();
    }
})();