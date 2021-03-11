<template>
</template>

<script>
    import {cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import ComponentActiveAwareMixin from './ComponentActiveAwareMixin' 
    import {util_throttle} from '@/util'
    export default {
        mixins: [ComponentActiveAwareMixin],
        data() {
            return {
                //dirty: false,
                cacheRouterMeta: '',
                cancelSources: []
            }
        },
        computed: {
            routerMeta() {
                return this.generateRouterMeta()
            }
        },
        beforeRouteEnter (to, from, next) {
            next(async vm => {
                //console.log('beforeRouteEnter')
                if(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta){
                    //window && window.scrollTo && window.scrollTo(0,0)
                    vm.routeResetHook()
                    vm.routeUpdateHook()             
                }
            })
        },
        beforeRouteUpdate (to, from, next) {
            //console.log('beforeRouteUpdate')
            let cacheRouterMeta = this.routerMeta
            next()
            if(this.routerMeta != cacheRouterMeta) {
                //window && window.scrollTo && window.scrollTo(0,0)
                if(this.resetBeforeUpdate) this.routeResetHook()
                this.routeUpdateHook() 
            }
        },
        beforeRouteLeave (to, from, next) {
            this.cacheRouterMeta = this.routerMeta
            next()
        },
        methods: {
            generateRouterMeta() {
                //if(!this.componentActive) return undefined
                return this.$route.fullPath
            },
            routeUpdateHook(){
                if(this.debug) console.log('routeUpdateHook')
                //if(this.resetBeforeUpdate) this.routeResetHook()
                this.network_getData()
            },
            routeResetHook(){
                if(this.debug) console.log('routeResetHook')
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
        /*     routerMeta(newOne,oldOne) {
                util_throttle.throttleByDelay(() => {
                    if(newOne && !this.componentActive) {
                        if(this.debug) console.log("get data ===== watch-routerMeta")
                        this.dirty = true
                        }
                    },50,this)
            },
            dirty(newOne,oldOne) {

            } */
        }
    }
</script>

<style scoped lang="scss">

</style>