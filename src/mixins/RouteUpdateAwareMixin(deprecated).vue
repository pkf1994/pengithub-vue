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
                cacheRouterMeta: undefined,
                cancelSources: [],
                resetBeforeUpdate: true,
                watchRouterMeta: true
            }
        },
        computed: {
            routerMeta() {
                return this.generateRouterMeta()
            }
        },
        created() {
            this.cacheRouterMeta = this.generateRouterMeta()
        },
        beforeRouteEnter (to, from, next) {
            next(async vm => {
               /*  if(vm.debug) {
                    console.log('==============================beforeRouteEnter===============================')
                    console.log("vm.cacheRouterMeta:" + vm.cacheRouterMeta)
                    console.log("vm.routerMeta:" + vm.routerMeta)
                    console.log("vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta && vm.componentActive:" + vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta)
                    console.log('==============================beforeRouteEnter===============================')
                }
                if(!vm.cacheRouterMeta) {
                    window && window.scrollTo && window.scrollTo(0,0)
                }
                if(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta) {
                    if(vm.debug) console.log("get data ===== beforeRouteEnter")
                    window && window.scrollTo && window.scrollTo(0,0)
                    vm.$el.style.display = 'none'
                    if(!vm.resetBeforeUpdate) vm.routeResetHook(to,from)
                    vm.cancelUntimelyAxios()
                    vm.routeUpdateHook(to,from)
                    setTimeout(() => {
                        vm.$el.style.display = 'block'
                    },500)
                } */
                 if(vm.debug) {
                    console.log('==============================beforeRouteEnter===============================')
                    console.log("vm.cacheRouterMeta:" + vm.cacheRouterMeta)
                    console.log("vm.routerMeta:" + vm.routerMeta)
                    console.log(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta)
                    console.log('==============================beforeRouteEnter===============================')
                }
                if(vm.cacheRouterMeta && vm.cacheRouterMeta != vm.routerMeta) {
                    vm.routeResetHook()
                    //vm.$el.style.display = 'none'
                }
            })
        },

            
        activated() {
            /* if(this.debug) {
                console.log('==============================activated===============================')
                console.log("this.cacheRouterMeta:" + this.cacheRouterMeta)
                console.log("this.routerMeta:" + this.routerMeta)
                console.log(this.cacheRouterMeta && this.cacheRouterMeta != this.routerMeta)
                console.log('==============================activated===============================')
            }   
            if(this.cacheRouterMeta && this.cacheRouterMeta != this.routerMeta) {
                if(this.debug) {
                    console.log("get data ===== activated")
                }
                window && window.scrollTo && window.scrollTo(0,0)
                this.$el.style.display = 'none'
                if(!this.resetBeforeUpdate) this.routeResetHook()
                this.cancelUntimelyAxios()
                this.routeUpdateHook()
                setTimeout(() => {
                    this.$el.style.display = 'block'
                },500)
            } */
        },
        methods: {
            generateRouterMeta() {
                //if(!this.componentActive) return undefined
                return this.$route.fullPath 
            },
            routeUpdateHook(){
                if(this.debug) console.log('routeUpdateHook')
                if(this.resetBeforeUpdate) this.routeResetHook()
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
            routerMeta(newOne,oldOne) {
                if(this.debug) {
                    console.log('========================watch routerMeta========================')
                    console.log(newOne)
                    console.log(oldOne)
                    console.log(this.componentActive)
                    console.log('========================watch routerMeta========================')
                }
                util_throttle.throttleByDelay(() => {
                    if(newOne && this.componentActive && this.watchRouterMeta && this.routerMeta != this.cacheRouterMeta) {
                        if(this.debug) console.log("get data ===== watch-routerMeta")
                            //window && window.scrollTo && window.scrollTo(0,0)
                            //this.$el.style.display = 'none'
                            this.cancelUntimelyAxios()
                            this.routeUpdateHook()
                            /*  setTimeout(() => {
                                this.$el.style.display = 'block'
                            },0) */
                            this.cacheRouterMeta = this.routerMeta  
                            /*  setTimeout(() => {
                                this.$el.style.display = 'block'
                            },3000) */
                        }
                    },50,this)
            }
        }
    }
</script>

<style scoped lang="scss">

</style>