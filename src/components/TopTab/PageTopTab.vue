<template>
    <div class="tabs mt-2 px-3">
        <nav style="margin-bottom: -1px" class="no-wrap overflow-x-auto">
            <router-link class="router-link" v-for="tabItem in tabs"
                        exact
                        :key="tabItem.label"
                        :to="tabItem.to">
                {{tabItem.label}}
            </router-link>
        </nav>
    </div>
    
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
        border-bottom: 1px solid #e1e4e8;
    }
    .tabs>a:first-child {
        border-left: 0;
    }
    .router-link {
        display: inline-block;
        flex-shrink: 0;
        padding: 8px 16px;
        font-size: 14px;
        line-height: 23px;
        color: #24292e;
        text-decoration: none;
        background-color: initial;
        border: 1px solid transparent;
        border-bottom: 0;
    }
    .router-link-active{
        color: #444d56;
        background-color: #fff;
        border-color: #e1e4e8;
        border-radius: 6px 6px 0 0;
    }
</style>