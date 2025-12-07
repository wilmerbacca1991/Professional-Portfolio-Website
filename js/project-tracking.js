// Safe project click tracking: uses Plausible if loaded, otherwise logs to console
(function(){
    function track(projectName, action){
        action = action || 'click';
        try{
            if(window.plausible && typeof window.plausible === 'function'){
                window.plausible('Project Click', { props: { project: projectName, action: action } });
            } else {
                console.log('[analytics] Project Click:', projectName, action);
            }
        }catch(e){
            console.log('[analytics error]', e);
        }
    }

    function init(){
        var els = document.querySelectorAll('[data-project]');
        els.forEach(function(el){
            el.addEventListener('click', function(){
                var proj = el.getAttribute('data-project') || 'unknown';
                track(proj);
            });
        });
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();