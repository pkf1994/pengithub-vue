<template>
</template>

<script>
    import BaseIssuesPageTemplate from './BaseIssuesPageTemplate.vue'
    import {mapActions, mapState} from "vuex";
    import {IconPagination} from '../../../../components'
    import {
        ACTION_HOME_REQUEST_ISSUES,
        ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED
    } from "../../../../store/modules/home/actionTypes";
    import {MUTATION_HOME_RESOLVE_ISSUES} from "../../../../store/modules/home/mutationTypes";
    export default {
        data() {
            return {
                noDataMsg: "No item to show",
            }
        },
        computed: {
            ...mapState({
                loading: state => state.home.pullRequest.created.loading,
                data: state => state.home.pullRequest.created.nodes,
                pageInfo: state => state.home.issue.created.pageInfo,
                totalCount: state => state.home.issue.created.totalCount,
                perPage: state => state.home.issue.created.perPage
            }),
            noData: function () {
                return (!this.data || this.data.length === 0) && !this.loading
            },
            showPagination: function () {
                return this.totalCount > this.perPage
            }
        },

        destroyed() {
            console.log("destroyed")
        },
        activated() {
            console.log("activated")
        },
        deactivated () {
            console.log("deactivated")
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_ISSUES
            })
        },

        components: {
           IconPagination,
            BaseIssuesPageTemplate
        }
    }
</script>

<style scoped>

</style>