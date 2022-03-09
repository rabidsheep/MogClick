const lang = window.location.pathname.match(/\b[a-zA-Z]{2}\-{1}[a-zA-Z]{2}\b/g)[0];
const isHomepage = window.location.pathname.match(/[a-zA-Z]{2}\-{1}[a-zA-Z]{2}(\/?)$/g);
const selectors = {
    contentBox: isHomepage ? ".item-list-top-all" : ".item-liquid-box",
    seeMore: ".container-navi > .container-btns > a",
    itemCard: "a.item-card"
};
const config = { childList: true, subtree: true };

const mogLog = (str) => {
    console.log("%c[MogClick]", "background-color: #e45274; color: white; font-weight: 700;", str);
};

const reformatItemCard = (card) => {
    card.__vue__._events["click-item-card"] = null;
    let data = card.__vue__;
    card.setAttribute("target", "_blank");
    card.setAttribute("href", `https://store.finalfantasyxiv.com/ffxivstore/${lang}/product/${data.item.id}`);
};

const waitForBase = () => {
    const callback = function(mutationsList, observer) {
        if (document.querySelector(selectors.contentBox)) {
            mogLog("Disconnecting body observer");
            observer.disconnect();
            waitForCards();
        }
    };
    
    const body = document.querySelector("body");
    const observer = new MutationObserver(callback);

    mogLog("Initiating body observer");
    observer.observe(body, config);
};

const waitForCards = () => {
    let cards = document.querySelectorAll(selectors.itemCard);
    if (cards.length > 0) cards.forEach((card) => reformatItemCard(card));

    const callback = function(mutationsList, observer) {
        Promise.all([
            mutationsList
            .filter((mutation) => mutation.type === "childList")
            .forEach((mutation) => {
                let card = mutation.addedNodes[0].querySelector(selectors.itemCard);
                if (card) reformatItemCard(card);
            })
        ])
        .then(() => {
            if (!document.querySelector(selectors.seeMore)) {
                mogLog("Disconnecting card observer");
                observer.disconnect();
            }
        })
    };

    const target = document.querySelector(selectors.contentBox);
    const observer = new MutationObserver(callback);

    mogLog("Initiating card observer");
    observer.observe(target, config);
};

waitForBase();