<template>
    <IssuesBrowser ref="issueBrowser" type="pr" routerPathFragment="pulls"></IssuesBrowser>
</template>

<script>
    import styled from 'vue-styled-components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    var parse = require('parse-link-header');
    import {mapState} from 'vuex'
     import {RouteUpdateAwareMixin} from '@/mixins'
    import IssuesBrowser from '../Issues/IssuesBrowser.vue'
    export default {
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo'],
        computed: {
            documentTitle() {
                return `Pull Requests · ${this.owner()}/${this.repo()}`
            }
        },
        components: {
            IssuesBrowser
        },
        methods: {
            routeUpdateHook() {
                this.$refs.issueBrowser.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$refs.issueBrowser.$data, this.$refs.issueBrowser.$options.data())
            }
        }
       
    }
</script>

<style scoped lang="scss">

</style>