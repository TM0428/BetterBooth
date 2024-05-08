import { getFromLocalStorage, mergeToLocalStorage, setToLocalStorage } from "./chrome_storage";

export async function setItemData(data) {
    const itemId = "items_" + String(data.id);
    try {
        const result = await getFromLocalStorage("items");
        let items = result.items;

        if (items && !items.includes(itemId)) {
            // アイテムが存在しないとき
            items.push(itemId);
            await setToLocalStorage({ items: items });
            await setToLocalStorage({ [`${itemId}`]: data });
        }
        else if (items) {
            // 既にあるため、元のデータとのマージ
            const oldDataResult = await getFromLocalStorage(itemId);
            const oldData = oldDataResult[itemId];
            // oldDataのtagを一時保存
            data.tags = oldData.tags;

            await mergeToLocalStorage(itemId, data);
        }
        else {
            // リストの新規作成
            items = [itemId];
            await setToLocalStorage({ items: items });
            await setToLocalStorage({ [`${itemId}`]: data });
        }
        return 0;
    }
    catch (err) {
        console.error(err);
        return 1;
    }
}
