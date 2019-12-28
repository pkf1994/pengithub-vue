<template>
</template>

<script>
    import BaseIssuesPageTemplate from './BaseIssuesPageTemplate.vue'
    import {mapActions, mapState} from "vuex";
    import {IconPagination} from '../../../../components'
    import {ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED} from "../../../../store/modules/home/actionTypes";
    export default {
        data() {
            return {
                noDataMsg: "No item to show"
            }
        },
        computed: {
            ...mapState({
                loading: state => state.home.pullRequests.created.loading,
                data: state => state.home.pullRequests.created.nodes,
                pageInfo: state => state.home.issues.created.pageInfo,
                totalCount: state => state.home.issues.created.totalCount,
                perPage: state => state.home.issues.created.perPage
            }),
            noData: function () {
                return (!this.data || this.data.length === 0) && !this.loading
            },
            showPagination: function () {
                return this.totalCount > this.perPage
            }
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED
            })
        },
        created(){
            this.action_getData()
        },
        components: {
           IconPagination,
            BaseIssuesPageTemplate
        }
    }
</script>

<style scoped>

</style>