<template>
</template>

<script>
    import {cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import ComponentActiveAwareMixin from './ComponentActiveAwareMixin' 
    export default {
        mixins: [ComponentActiveAwareMixin],
        data() {
            return {
                cacheRouterMeta: undefined,
                cancelSources: []
            }
        },
        computed: {
            routerMeta() {
                return this.generateRouterMeta()
            }
        },
        beforeRouteLeave(to, from, next) {
            this.cacheRouterMeta = this.routerMeta
            next()
        },
        beforeRouteEnter (to, from, next) {
            next(async vm => {
                if(vm.debug) {
                    console.log('==============================beforeRouteEnter===============================')
                    console.log(vm.cacheRouterMeta)
                    console.log(vm.routerMeta)
                    console.log(vm.componentActive)
                    console.log(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta && vm.componentActive)
                    console.log('==============================beforeRouteEnter===============================')
                }
                if(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta && vm.componentActive) {
                    vm.$el.style.display = 'none'
                    vm.routeResetHook(to,from)
                    vm.cancelUntimelyAxios()
                    vm.routeUpdateHook(to,from)
                    setTimeout(() => {
                        vm.$el.style.display = 'block'
                    },500)
                }
            })
        },
        /* beforeRouteUpdate (to, from, next) {
            if(this.routerMeta != this.generateRouterMeta() && this.componentActive) {
                if(this.debug) {
                    console.log(this.routerMeta)
                    console.log(this.generateRouterMeta())
                }
                this.cancelUntimelyAxios()
                this.routeUpdateHook(to,from)
                this.routerMeta = this.generateRouterMeta()
            }
            next()
        }, */
        methods: {
            generateRouterMeta() {
                return JSON.stringify(this.$route.params) + JSON.stringify(this.$route.query) 
            },
            routeUpdateHook(){
                if(this.debug) console.log('routeUpdateHook')
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
        },
        watch: {
            routerMeta(newOne,oldOne) {
                if(this.debug) {
                    console.log('========================watch routerMeta========================')
                    console.log(newOne)
                    console.log(oldOne)
                    console.log(this.componentActive)
                    console.log('========================watch routerMeta========================')
                }
                if(newOne && oldOne && this.componentActive) this.routeUpdateHook()
            }
        }
    }
</script>

<style scoped lang="scss">

</style>