<template>
    <div>
      <div>
        <h1>{{ data.name }}</h1>
        <p v-html="formatDescription(data.description)"></p>
        <img :src="data.images[0].original" alt="Item Image" />
      </div>
      <router-link :to="{ name: 'Top' }">Top</router-link>
    </div>
</template>
  
<script>
export default {
    props: ['itemId'], // ルートパラメータをpropsとして受け取る
    data() {
        return {
            data: {
                name: "",
                images: [""],
                description: ""
            }
        }
    },

    created() {
        chrome.storage.local.get(`items_${this.itemId}`, result => {
            this.data = result[`items_${this.itemId}`];
            console.log(this.data);
        })
    },

    methods: {
        formatDescription(description) {
        return description.replace(/\n/g, "<br>");
        },
    },
};
</script>
  
