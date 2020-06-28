<template>
    <Issues ref="issues" type="pr" routerPathFragment="pulls"></Issues>
</template>

<script>
    import Issues from './Issues'
    import {RouteUpdateAwareMixin} from '@/mixins'
    export default {
        mixins: [RouteUpdateAwareMixin],
        methods: {
             routeUpdateHook() {
                this.$refs.issues.network_getData()
                this.$refs.issues.closeModal()
            },
            routeResetHook() {
                Object.assign(this.$refs.issues.$data, this.$refs.issues.$options.data())
            },
        },
        components: {
            Issues
        }
    }
</script>

<style scoped lang="scss">
.subnav-item:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
.subnav-item:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.subnav-item {
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
.reaction-item{
    margin: 0!important;
    font-family: Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
    font-size: 1.2em;
    font-style: normal!important;
    font-weight: 400;
    line-height: 20px;
    border: 1px solid transparent;
    border-radius: 3px;
    opacity: .7;
}
.reaction-active{
    background-color: #f1f8ff;
    border-color: #0366d6;
    opacity: 1
}
</style>