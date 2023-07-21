<template>
    <div>
        <h1 class="page-title">保存したアイテム一覧</h1>
        <div class="help-and-search">
            <div class="help-link">
                <router-link :to="{ name: 'Howto' }" class="help-link-text"
                    >使い方について</router-link
                >
            </div>
            <div class="search-bar">
                <div class="search-icon">
                    <img src="@/assets/search.svg" alt="Search Icon" />
                </div>
                <input
                    v-model="searchText"
                    type="text"
                    placeholder="アイテムを検索..."
                    class="search-input"
                />
            </div>
        </div>
        <div class="card-list">
            <router-link
                v-for="item in filteredItemList"
                :key="item.id"
                :to="{ name: 'Item', params: { itemId: item.id } }"
                class="card"
            >
                <div class="card-image-container">
                    <img
                        :src="item.image"
                        class="card-image"
                        alt="Item Image"
                    />
                </div>
                <div class="card-content">
                    <p class="card-name">{{ item.name }}</p>
                </div>
            </router-link>
            <div class="card" @click="uploadDataCardClicked">
                <div class="card-image-container">
                    <img
                        src="@/assets/add_circle.svg"
                        class="card-svg-image"
                        alt="Add Icon"
                    />
                </div>
                <div class="card-content">
                    <p class="card-name">データをインポート...</p>
                </div>
            </div>
        </div>
        <a class="page-title" href="/src/popup/popup.html">設定ページへ</a>
        <input
            ref="uploadInput"
            type="file"
            accept=".json"
            style="display: none"
            @change="onFileChange"
            :key="inputKey"
        />
    </div>
</template>

<style>
.page-title {
    text-align: center;
}

.help-and-search {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 10px;
}

.help-link {
    text-align: right;
}

.help-link-text {
    text-decoration: none;
}

.search-bar {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
}

.search-icon img {
    width: 16px;
    height: 16px;
}

.search-input {
    padding: 5px 10px 5px 30px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 16px;
    width: 100%;
}

.search-input:focus {
    border: 1px solid #999;
}

.card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 250px;
    height: 300px;
    text-decoration: none;
    cursor: pointer;
}

.card:hover {
    border-color: #999;
}

.card-image-container {
    width: 250px;
    height: 200px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.card-svg-image {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.card-content {
    text-align: center;
}

.card-name {
    font-size: 15px;
}
</style>

<script>
export default {
    data() {
        return {
            itemList: [],
            searchText: "",
            inputKey: 0,
        };
    },
    computed: {
        filteredItemList() {
            if (this.searchText.trim() === "") {
                return this.itemList;
            } else {
                const keyword = this.searchText.toLowerCase();
                return this.itemList.filter(
                    (item) =>
                        item.name.toLowerCase().includes(keyword) ||
                        item.shopName.toLowerCase().includes(keyword)
                );
            }
        },
    },
    methods: {
        uploadDataCardClicked() {
            this.$refs.uploadInput.click();
        },
        onFileChange(event) {
            this.inputKey += 1;
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                if (this.validateData(data)) {
                    // Only keep the required properties from the data object
                    const sanitizedData = {
                        additionalDescription:
                            data.additionalDescription || null,
                        description: data.description,
                        id: data.id,
                        price: data.price || "",
                        images: data.images || [],
                        name: data.name,
                        price: data.price || null,
                        shop: data.shop || null,
                    };
                    console.log(sanitizedData);

                    this.addStorage(sanitizedData);
                    // Perform any further operations with the sanitizedData
                } else {
                    console.log("Invalid data format.");
                    window.alert("無効な入力データです。");
                }
            };
            reader.readAsText(file);
        },
        validateData(data) {
            // データがオブジェクトで、必要なプロパティが含まれているかを確認するバリデーション
            return (
                typeof data === "object" &&
                data !== null &&
                "description" in data &&
                typeof data.description === "string" &&
                "id" in data &&
                typeof data.id === "number" &&
                "images" in data &&
                Array.isArray(data.images) &&
                data.images.every(
                    (image) =>
                        typeof image === "object" &&
                        image !== null &&
                        "original" in image &&
                        typeof image.original === "string" &&
                        "resized" in image &&
                        typeof image.resized === "string"
                ) &&
                "name" in data &&
                typeof data.name === "string" &&
                "price" in data &&
                typeof data.price === "string" &&
                "shop" in data &&
                typeof data.shop === "object" &&
                data.shop !== null &&
                "name" in data.shop &&
                typeof data.shop.name === "string" &&
                "subdomain" in data.shop &&
                typeof data.shop.subdomain === "string" &&
                "url" in data.shop &&
                typeof data.shop.url === "string"
            );
        },
        addStorage(data) {
            const itemId = "items_" + String(data.id);
            chrome.storage.local.get("items", (result) => {
                var items = result.items;
                if (items && !items.includes(itemId)) {
                    // 新たに登録
                    items.push(itemId);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else if (items) {
                    // 既に登録されているので更新
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else {
                    // リスト作成と登録
                    items = [itemId];
                    console.log(items);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                }

                window.alert("データを追加しました。");
                this.reloadList();
            });
        },
        reloadList() {
            chrome.storage.local.get("items", (result) => {
                const itemIdList = result.items || [];
                this.itemList = [];
                itemIdList.forEach((itemId) => {
                    chrome.storage.local.get(`${itemId}`, (itemResult) => {
                        const itemData = itemResult[itemId];
                        if (itemData && itemData.name) {
                            this.itemList.push({
                                id: itemId.replace("items_", ""),
                                name: itemData.name,
                                shopName: itemData.shop.name,
                                image: itemData.images[0].original,
                            });
                        }
                    });
                });
                console.log(this.itemList);
            });
        },
    },
    created() {
        chrome.storage.sync.get("extended_settings", (result) => {
            const setting = result.extended_settings;
            if (!(setting && setting.save_item)) {
                window.location.href = "/src/popup/popup.html";
                return;
            }
        });
        chrome.storage.local.get("items", (result) => {
            const itemIdList = result.items || [];
            itemIdList.forEach((itemId) => {
                chrome.storage.local.get(`${itemId}`, (itemResult) => {
                    const itemData = itemResult[itemId];
                    if (itemData && itemData.name) {
                        this.itemList.push({
                            id: itemId.replace("items_", ""),
                            name: itemData.name,
                            shopName: itemData.shop.name,
                            image: itemData.images[0].original,
                        });
                    }
                });
            });
        });
    },
};
</script>
