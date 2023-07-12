<template>
    <div class="card-list">
        <router-link v-for="item in itemList" :key="item.id" :to="{ name: 'Item', params: { itemId: item.id } }" class="card">
        <div class="card-image-container">
            <img :src="item.image" class="card-image" alt="Item Image">
        </div>
        <div class="card-content">
            {{ item.name }}
        </div>
        </router-link>
    </div>
</template>

<style>
.card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
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

.card-content {
    font-size: 15px;
    text-align: center;
}
</style>

<script>
export default {
data() {
    return {
    itemList: []
    };
},
created() {
    chrome.storage.local.get("items", result => {
    const itemIdList = result.items || [];
    itemIdList.forEach(itemId => {
        chrome.storage.local.get(`${itemId}`, itemResult => {
        const itemData = itemResult[itemId];
        if (itemData && itemData.name) {
            this.itemList.push({
            id: itemId.replace('items_', ''),
            name: itemData.name,
            image: itemData.images[0].original
            });
        }
        });
    });
    });
}
};
</script>
  