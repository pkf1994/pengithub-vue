<template>
</template>

<script>
    export default {
        data() {
            return {
                routerMeta: undefined,
                cancelSources: []
            }
        },
        created() {
            this.routerMeta = this.generateRouterMeta()
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(vm.routerMeta && vm.routerMeta !== vm.generateRouterMeta()) {
                    vm.cancelUntimelyAxios()
                    vm.routeResetHook()
                    vm.routeUpdateHook()
                    vm.routerMeta = vm.generateRouterMeta()
                }
            })
        },
        beforeRouteUpdate (to, from, next) {
            next()
            if(this.routerMeta !== this.generateRouterMeta()) {
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
                console.log('routeUpdateHook')
            },
            routeResetHook(){
                console.log('routeResetHook')
            },
            cancelUntimelyAxios() {
                this.cancelSources.forEach(item => {
                    item.cancel()
                })
                this.cancelSources = []
            }
        }
    }
</script>

<style scoped lang="scss">

</style>