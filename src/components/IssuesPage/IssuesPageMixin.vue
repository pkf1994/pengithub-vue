<template>
</template>

<script>
    import IssuesPageTemplate from './IssuesPageTemplate.vue'
    import {mapActions, mapState} from "vuex";
    import {IconPagination} from '../Pagination'
    import {
        ACTION_HOME_REQUEST_ISSUES
    } from "../../store/modules/home/actionTypes";
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

        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_ISSUES
            })
        },

        components: {
            IconPagination,
            IssuesPageTemplate
        }
    }
</script>

<style scoped>

</style>