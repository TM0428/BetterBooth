/**
 * matches: "https://booth.pm/gifts/*",
 * このスクリプトはギフトページに関する処理を記述します
 */

async function getFilterDataModule() {
    const src = chrome.runtime.getURL("./js/module/filter_data.js");
    return await import(src);
}

async function getSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    return await import(src);
}

async function main() {
    const filterModule = await getFilterDataModule();
    const settingsModule = await getSettingsModule();
    const extended_settings = await settingsModule.getExtendedSettings();

    // aタグの中からショップURLを探す
    const aElements = document.querySelectorAll('a[href*=".booth.pm"]');
    let shopLinkElement = null;
    let shopUrl = null;

    for (const a of aElements) {
        const href = a.href;
        // ショップURL（例: https://tm428.booth.pm/）かどうかを判定（アイテムや検索ページは除く）
        if (href.match(/^https:\/\/[a-zA-Z0-9_-]+\.booth\.pm\/?$/)) {
            // ショップ名が含まれる要素（ユーザーアイコンなどがある部分）であるか確認
            if (a.querySelector(".text-text-gray600")) {
                shopLinkElement = a;
                shopUrl = href;
                break;
            }
        }
    }

    if (!shopLinkElement) return;

    filterModule.getFilter(extended_settings.getFilterMode).then((filterArray) => {
        // boothのショップURLは末尾のスラッシュ有無の揺れがあるため考慮
        const hasMatch =
            filterArray &&
            filterArray.some((f) => {
                const fNormalized = f.replace(/\/$/, "");
                const sNormalized = shopUrl.replace(/\/$/, "");
                return fNormalized === sNormalized;
            });

        if (hasMatch) {
            // ブロックされている場合、画像を畳んで表示する
            const imageContainer =
                document.querySelector("div.mx-auto.w-\\[400px\\].h-\\[400px\\]") ||
                document.querySelector(".mx-auto.w-\\[400px\\]") ||
                document.querySelector('img[src*="booth.pximg.net/"]')?.parentElement;

            if (imageContainer) {
                // 元の表示状態を保存
                const originalDisplay = imageContainer.style.display;
                imageContainer.style.display = "none";

                // トグルボタン（非表示の案内）を作成
                const toggleDiv = document.createElement("div");
                toggleDiv.className = "mt-8 text-center";
                toggleDiv.style.cursor = "pointer";
                toggleDiv.style.color = "#999";
                toggleDiv.style.fontSize = "14px";
                toggleDiv.style.border = "1px solid #ccc";
                toggleDiv.style.padding = "8px";
                toggleDiv.style.borderRadius = "8px";
                toggleDiv.style.userSelect = "none";
                toggleDiv.textContent = "ブロック中のため画像を非表示にしています (クリックで表示)";

                toggleDiv.addEventListener("click", () => {
                    if (imageContainer.style.display === "none") {
                        imageContainer.style.display = originalDisplay;
                        toggleDiv.textContent = "画像を非表示にする";
                    } else {
                        imageContainer.style.display = "none";
                        toggleDiv.textContent =
                            "ブロック中のため画像を非表示にしています (クリックで表示)";
                    }
                });

                imageContainer.parentNode.insertBefore(toggleDiv, imageContainer);
            }

            // ショップ名辺りにブロック中であることを表示する
            const shopNameDiv = shopLinkElement.querySelector(".text-text-gray600");
            if (shopNameDiv) {
                const badge = document.createElement("span");
                badge.textContent = "ブロック中";
                badge.style.marginLeft = "8px";
                badge.style.fontSize = "12px";
                badge.style.color = "#fff";
                badge.style.backgroundColor = "#ff4d4f";
                badge.style.padding = "2px 6px";
                badge.style.borderRadius = "4px";
                badge.style.fontWeight = "bold";
                badge.style.whiteSpace = "nowrap";

                // flexコンテナ内に追加
                shopNameDiv.parentNode.appendChild(badge);
            }
        }
    });
}

main();
