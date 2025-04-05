<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div>
        {{ shopId }}
    </div>
</template>

<script>
import AppBar from "../components/AppBar.vue";

export default {
    props: ["shopId"],
    components: {
        AppBar
    }
};
</script>
