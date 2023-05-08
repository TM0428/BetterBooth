<template>
  <div>
    <h1>Filters:</h1>
    <ul>
      <li v-for="(filter, index) in filters" :key="filter">
        {{ filter }}
        <button @click="removeFilter(index)">Remove</button>
      </li>
    </ul>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      filters: []
    };
  },
  methods: {
    removeFilter(index) {
      this.filters.splice(index, 1);
      console.log(this.filters);
      chrome.storage.sync.set({filters: Array.from(this.filters)})
    },
  },
  created() {
    chrome.storage.sync.get("filters", result => {
      this.filters = result.filters || [];
    });
  }
};
</script>
  