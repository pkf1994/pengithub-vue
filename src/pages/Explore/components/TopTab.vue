<template>
    <nav class="px-3 mx-auto">
        <Inner class="d-flex flex-wrap flex-items-center flex-justify-center text-center">
            <router-link to="/explore" active-class="explore-selected" class="explore-link subnav-link d-inline-block f5 py-0 mt-2 mr-0 no-underline">Explore</router-link>
            <router-link to="/topics" class="d-inline-block py-2 mr-3 no-underline subnav-link">Topics</router-link>
            <router-link to="/trending" class="d-inline-block py-2 mr-3 no-underline subnav-link">Trending</router-link>
            <router-link to="/collections" class="d-inline-block py-2 mr-3 no-underline subnav-link">Collections</router-link>
        </Inner>   
    </nav>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        components: {
            Inner: styled.div``
        }
    }
</script>

<style scoped>
nav{
    box-shadow: 0 1px 0 rgba(0,0,0,.1);
}
.explore-link{
    flex-basis: 100%;
    border-bottom-color: transparent;
}
.subnav-link {
    font-size: 12px;
    color: #6a737d;
    cursor: pointer;
    border: 0;
    border-bottom: 2px solid transparent;
    transition: border-bottom-color .4s;
}
.router-link-active {
    font-weight: 500;
    color: #1b1f23!important;
    border-bottom-color: #1074e7;
}
.explore-selected{
    font-weight: 500;
    color: #1b1f23!important;
}
</style>