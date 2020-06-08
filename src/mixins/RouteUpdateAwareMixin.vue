<template>
</template>

<script>
    import {cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import ComponentActiveAwareMixin from './ComponentActiveAwareMixin' 
    export default {
        mixins: [ComponentActiveAwareMixin],
        data() {
            return {
                routerMeta: undefined,
                cancelSources: []
            }
        },
        created() {
           // console.log(this.$route)
            this.routerMeta = this.generateRouterMeta()
        },
        
        beforeRouteEnter (to, from, next) {
            next(async vm => {
                if(vm.routeUpdateAwareMixinDebugFlag) {
                    console.log('beforeRouteEnter')
                }
                if(vm.routerMeta && vm.routerMeta != vm.generateRouterMeta() && vm.componentActive) {
                    vm.routeResetHook()
                    vm.cancelUntimelyAxios()
                    /* await (function(time) {
                        return new Promise((resolve) => setTimeout(resolve, time));
                    })(3000) */
                    vm.routeUpdateHook()
                    vm.routerMeta = vm.generateRouterMeta() 
                }
            })
        },
        beforeRouteUpdate (to, from, next) {
            next()
            if(this.routerMeta != this.generateRouterMeta() && this.componentActive) {
                this.cancelUntimelyAxios()
                this.routeUpdateHook()
                this.routerMeta = this.generateRouterMeta()
            }
        },
        methods: {
            generateRouterMeta() {
                return JSON.stringify(this.$route.params) + JSON.stringify(this.$route.query) 
            },
            routeUpdateHook(){
                this.network_getData()
            },
            routeResetHook(){
               // console.log('routeResetHook')
                Object.assign(this.$data,this.$options.data())
            },
            cancelUntimelyAxios() {
                this.cancelSources.forEach(item => {
                    item.cancel()
                })
                this.cancelSources = []
            },
            cancelAndUpdateAxiosCancelTokenSource(meta) {
                let cancelTokenAndSource = cancelAndUpdateAxiosCancelTokenSource(meta)
                this.cancelSources.push(cancelTokenAndSource.source)
                return cancelTokenAndSource.cancelToken
            }
        }
    }
</script>

<style scoped lang="scss">

</style>