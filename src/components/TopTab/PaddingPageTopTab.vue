<template>
    <nav class="px-3 pt-3 d-flex">
        <router-link v-for="item in tabs" :key="item.to" :to='item.to' class="nav-item flex-1 text-center" :class="{'active':item.activeFlag}">{{item.label}}</router-link>
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
.nav-item:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
.nav-item:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.nav-item {
    position: relative;
    float: left;
    padding: 6px 14px;
    font-weight: 600;
    line-height: 20px;
    color: #586069;
    border: 1px solid #e1e4e8;
}
.active{
    color: #fff;
    background-color: #0366d6;
    border-color: #0366d6;
}
</style>