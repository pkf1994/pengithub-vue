<template>
    <nav class="tabs">
        <router-link class="router-link" v-for="tabItem in tabs"
                     :key="tabItem.label"
                     :to="tabItem.to">
            {{tabItem.label}}
        </router-link>
    </nav>
</template>

<script>
    export default {
        props: {
            tabs: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>
    .tabs {
        display: table;
        width: 100%;
        table-layout: fixed;
    }
    .tabs>a:first-child {
        border-left: 0;
    }
    .router-link {
        display: table-cell;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid #dfe2e5;
    }
    .router-link-active{
        color: #444d56;
        background-color: #fff;
        border-right: 1px solid #dfe2e5;
        border-bottom-color: #fff;
        border-left: 1px solid #dfe2e5;
    }
</style>