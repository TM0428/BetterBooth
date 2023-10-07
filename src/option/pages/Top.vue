<template>
    <div>
        <h1 class="page-title">{{ lang.topTitle }}</h1>
        <div class="help-and-search">
            <div class="help-link">
                <router-link :to="{ name: 'Howto' }" class="help-link-text">{{
                    lang.topHowto
                }}</router-link>
            </div>
            <div class="search-bar">
                <div class="search-icon">
                    <img src="@/assets/search.svg" alt="Search Icon" />
                </div>
                <input
                    v-model="searchText"
                    type="text"
                    :placeholder="lang.topSearchText"
                    class="search-input"
                />
            </div>
        </div>
        <div class="card-list">
            <!-- <router-link
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
            </router-link> -->
            <ItemCard
                v-for="item in filteredItemList"
                :key="item.id"
                :item="item"
            />
            <div class="card" @click="uploadDataCardClicked">
                <div class="card-image-container">
                    <img
                        src="@/assets/add_circle.svg"
                        class="card-svg-image"
                        alt="Add Icon"
                    />
                </div>
                <div class="card-content">
                    <p class="card-name">{{ lang.topImport }}</p>
                </div>
            </div>
        </div>
        <a class="page-title" href="/src/popup/popup.html">{{
            lang.topSetttings
        }}</a>
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
</style>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import ItemCard from "../components/ItemCard.vue";

export default {
    components: {
        ItemCard,
    },
    data() {
        return {
            itemList: [],
            searchText: "",
            inputKey: 0,
            lang: ja,
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
                    window.alert(this.lang.topInvalid);
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

                window.alert(this.lang.topDataAdd);
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
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        // console.log(userLocale);
        switch (userLocale) {
            case "en":
                this.lang = en;
                break;
            case "ko":
                this.lang = ko;
                break;
            case "zh-CN":
                this.lang = zh_cn;
                break;
            case "zh-TW":
                this.lang = zh_tw;
                break;
            case "zh":
                this.lang = zh_cn;
                break;
            default:
                this.lang = ja;
        }
        chrome.storage.sync.get("extended_settings", (result) => {
            const extended_settings = result.extended_settings;
            if (!(extended_settings && extended_settings.save_item)) {
                window.location.href = "/src/popup/popup.html";
                return;
            }
            if (extended_settings && extended_settings.language) {
                switch (extended_settings.language) {
                    case "ko":
                        this.lang = ko;
                        break;
                    case "zh-CN":
                        this.lang = zh_cn;
                        break;
                    case "zh-TW":
                        this.lang = zh_tw;
                        break;
                    case "zh":
                        this.lang = zh_cn;
                        break;
                    case "en":
                        this.lang = en;
                        break;
                    default:
                        this.lang = ja;
                }
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
