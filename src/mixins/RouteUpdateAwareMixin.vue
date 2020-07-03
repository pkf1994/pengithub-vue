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
        beforeMount() {
            if(this.debug) {
                console.log('beforeMount')
            }
        },
        beforeRouteEnter (to, from, next) {
            next(async vm => {
                if(vm.debug) {
                    console.log('beforeRouteEnter')
                }
                if(vm.routerMeta && vm.routerMeta != vm.generateRouterMeta() && vm.componentActive) {
                    vm.$el.style.display = 'none'
                    vm.routeResetHook(to,from)
                    vm.cancelUntimelyAxios()
                    vm.routeUpdateHook(to,from)
                    vm.routerMeta = vm.generateRouterMeta() 
                }
                setTimeout(() => {
                    vm.$el.style.display = 'block'
                },0)
            })
        },
        beforeRouteUpdate (to, from, next) {
            next()
            if(this.routerMeta != this.generateRouterMeta() && this.componentActive) {
                if(this.debug) {
                    console.log(this.routerMeta)
                    console.log(this.generateRouterMeta())
                }
                this.cancelUntimelyAxios()
                this.routeUpdateHook(to,from)
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