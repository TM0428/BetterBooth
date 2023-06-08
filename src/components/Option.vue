<template>
  <div>
    <h1>Filters:</h1>
    <ul class="filter-list">
      <li v-for="(filter, index) in filters" :key="filter" class="filter-item">
        <a :href="filter" target="_blank">
          {{ filter }}
        </a>
        <button @click="removeFilter(index)" class="filter-item right-side">Remove</button>
      </li>
    </ul>
    <h1>Settings:</h1>
    <ul class="search-setting">
      <li>
        年齢制限
        <select class="right-side" v-model="settings.age">
          <option value="include">指定なし</option>
          <option value="default">全年齢のみ</option>
          <option value="only">R18のみ</option>
        </select>
      </li>
      <li>
        ソート条件
        <select class="right-side" v-model="settings.sort">
          <option value="">人気順</option>
          <option value="new">新着順</option>
          <option value="wish_list">スキ順</option>
          <option value="price_desc">価格が高い順</option>
          <option value="price_asc">価格が低い順</option>
        </select>
      </li>
      <li>
        在庫なし・販売終了を含む
        <input class="right-side" type="checkbox" v-model="in_stock">
      </li>
      <li>
        最近公開された商品のみ
        <input class="right-side" type="checkbox" v-model="settings.new_arrival">
      </li>
      <li>
        <button @click="saveData()">Save</button>
      </li>
    </ul>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      filters: [],
      settings: {
        age: "include",
        sort: "",
        in_stock: false,
        new_arrival: false
      },
      in_stock: true,
    };
  },
  methods: {
    removeFilter(index) {
      this.filters.splice(index, 1);
      console.log(this.filters);
      chrome.storage.sync.set({filters: Array.from(this.filters)})
    },
    stockBoxChange(value) {
      this.settings.stock = value;
    },
    saveData(){
      this.settings.in_stock = !this.in_stock;
      chrome.storage.sync.set({settings: this.settings});
      console.log(this.settings);
    }
  },
  created() {
    chrome.storage.sync.get("filters", result => {
      this.filters = result.filters || [];
    });
    chrome.storage.sync.get("settings", result => {
      console.log(result.settings);
      if(result.settings !== undefined){
        this.settings = result.settings;
        this.in_stock = this.settings.in_stock || true;
      }
    })
  }
};
</script>
<style scoped>
.filter-list {
  min-width: 350px;
  width: 400px;
  max-height: 200px;
  overflow: scroll;
}
.right-side {
  float: right;
}
.search-setting {
  min-width: 350px;
  width: 400px;
  max-height: 200px;
}
ul {
  box-shadow :0px 0px 3px silver;
  border: solid 1px whitesmoke;
  padding: 0.5em 1em 0.5em 2.3em;
  position: relative;
  background: #fafafa;
}

ul li {
  line-height: 1.5;
  padding: 0.5em 0;
  list-style-type: none!important;
  font-size: larger;
  font-family: 游ゴシック;
}

</style>