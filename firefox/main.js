const isRanking = window.location.pathname.match(/\/ranking(\/?)$/g);

if (isRanking) {
    console.log(
        "%c[MogClick]", 
        "background-color: #e45274; color: white; font-weight: 700;",
        "MogClick currently doesn't work on the MogStation best sellers page. Sorry!"
    );
} else {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('mogclick.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}