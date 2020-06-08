<template>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SimplePagination,SimplePaginationRest,IconSearchInput} from '../'
    import IssuesPageTemplate from './IssuesPageTemplate.vue'
    import {mapState, mapActions} from 'vuex'
    import { ACTION_HOME_REQUEST_ISSUES } from '../../store/modules/home/actionTypes'
    import {RouteUpdateAwareMixin} from '@/mixins'
    export default {
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                type: 'issue',
                belongTo: 'home',
                searchQuery: ''
            }
        },
        computed: {
            ...mapState({
                login: state => state.oauth.viewerInfo.login,
                loading: state => false,
                loadingAdditionalData: state => false,
                data: state => [],
                pageInfo: state => ({}),
                countInfo: state => ({})
            }),
            meta() {
                return this.$route.params.meta
            },
            query() {
                if(this.meta) {
                    switch(this.meta) {
                        case 'assigned':
                            this.searchQuery = `is:open is:${this.type} assignee:${this.login} archived:false`
                            return `is:open is:${this.type} assignee:${this.login} archived:false`
                        case 'mentioned':
                            this.searchQuery = `is:open is:${this.type} mentions:${this.login} archived:false`
                            return `is:open is:${this.type} mentions:${this.login} archived:false`
                        default:
                            return ''
                    }
                }
                if(!this.$route.query.q){
                    this.searchQuery = `is:open is:${this.type} author:${this.login} archived:false`
                }else{
                    this.searchQuery = this.$route.query.q
                }
                return this.$route.query.q || `is:open is:${this.type} author:${this.login} archived:false`
            },
        },
        created() {
            //console.log(this.$route)
            this.action_getData({
                issueType: this.type,
                belongTo: this.belongTo,
                q: this.query
            })
            this.routerMeta = this.generateRouterMeta()
        },
        watch: {
            query() {
                this.action_getData({
                    issueType: this.type,
                    belongTo: this.belongTo,
                    q: this.query
                })
            }
        },
        methods: {
            routeUpdateHook() {
                 this.action_getData({
                    issueType: this.type,
                    belongTo: this.belongTo,
                    q: this.query
                })
            },
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_ISSUES
            }),
            search() {
                this.$router.replace(`/issues?q=${this.searchQuery}`)
            }
        },
        components: {
          IssuesPageTemplate,
          IconSearchInput,
          SimplePagination,
          SimplePaginationRest
        }
    }
</script>

<style scoped lang="scss">

</style>