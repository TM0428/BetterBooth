<template>
  <div>
    <h1>Filters:</h1>
    <ul class="filter-list">
      <li v-for="(filter, index) in filters" :key="filter" class="filter-item">
        {{ filter }}
        <button @click="removeFilter(index)" class="filter-item">Remove</button>
      </li>
    </ul>
    <h1>Settings:</h1>
    <ul class="search-setting">
      <li>
        年齢制限
        <select v-model="ageselected" @change="ageHandleChange($event.target.value)">
          <option value="none">指定なし</option>
          <option value="all">全年齢のみ</option>
          <option value="r18">R18のみ</option>
        </select>
      </li>
      <li>
        ソート条件
        <select v-model="sortselected" @change="sortHandleChange($event.target.value)">
          <option value="">人気順</option>
          <option value="new">新着順</option>
          <option value="wish_list">スキ順</option>
          <option value="price_desc">価格が高い順</option>
          <option value="price_asc">価格が低い順</option>
        </select>
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
        age: "",
        sort: "",
      },
      ageselected: "none",
      sortselected: "",
    };
  },
  methods: {
    removeFilter(index) {
      this.filters.splice(index, 1);
      console.log(this.filters);
      chrome.storage.sync.set({filters: Array.from(this.filters)})
    },
    ageHandleChange(selectedValue) {
      this.settings.age = selectedValue;
      chrome.storage.sync.set({settings: this.settings});
      console.log(selectedValue);
    },
    sortHandleChange(selectedValue) {
      this.settings.sort = selectedValue;
      chrome.storage.sync.set({settings: this.settings});
      console.log(selectedValue);
    },
  },
  created() {
    chrome.storage.sync.get("filters", result => {
      this.filters = result.filters || [];
    });
    chrome.storage.sync.get("settings", result => {
      this.settings = result.settings || {};
      this.ageselected = this.settings.age || "none";
      this.sortselected = this.settings.sort || "";
    })
  }
};
</script>
<style scoped>
.filter-list {
  width: 400px;
}
.filter-list li button {
  float: right;
}
.search-setting {
  width: 400px;
}
.search-setting li select {
  float: right;
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