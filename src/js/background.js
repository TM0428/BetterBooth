

// コンテキストメニューの作成
chrome.contextMenus.create({
    id: "block-shop",
    title: "このショップをブロック",
    contexts: ["link"],
    documentUrlPatterns: ["*://booth.pm/*"],
});

/**
  * メニューが選択されたときの処理
  * 選択されたアイテムはこちらの関数の引数に入ってくる(今回は item)
  */
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "block-shop") {
        chrome.tabs.sendMessage(tab.id, {
            type: "contextMenuClick",
            target: info.target,
            pageUrl: info.pageUrl
        });
    }
});
/*
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "unvisibleContextMenu") {
        // コンテキストメニューの更新処理を行う
        console.log("menu will unvisible");
        chrome.contextMenus.update("block-shop", { visible: false, enabled: false });
    }
    if (request.type === "visibleContextMenu") {
        // コンテキストメニューの更新処理を行う
        console.log("menu will visible");
        chrome.contextMenus.update("block-shop", { visible: true, enabled: true });
    }
});
*/
