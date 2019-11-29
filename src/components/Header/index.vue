<template>
    <Container :theme="theme" :class="{'header-without-border':scrollTop===0}">
        <Menu>
            <i :theme="theme" class="iconfont icon-menu"/>
        </Menu>
        <Logo>
            <img src="../../assets/svg/github-icon.svg" alt="github-logo" height="100%">
        </Logo>
    </Container>
</template>

<script>
    import {
        Container,
        Menu,
        Logo
    } from './style'
    import ScrollTopListenerMixin from "../ScrollTopListenerMixin";
    import {mapState} from "vuex";
    export default {
        mixins:[ScrollTopListenerMixin],
        computed: {
            ...mapState({
                theme: state => state.ui.theme
            })
        },
        components: {
            Container,
            Logo,
            Menu
        }
    }
</script>

<style scoped lang="scss">
@import "../../scss/index";
@include with-theme();
    .header-without-border{
        border-width: 0px;
    }
</style>