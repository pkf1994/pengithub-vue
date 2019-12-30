<template>
    <BaseIssuesPageTemplate :data="data"
                            :loading="loading"
                            :noDataFlag="noData"
                            type="issue"
                            noDataMsg="No issue to show">
        <IconPagination v-if="showPagination"
                    :totalCount="totalCount"
                    :loading="loading"
                    :perPage="perPage"
                    :currentPage="currentPage"
                    :dataGetter="pagination_getData"
                    :pageInfo="pageInfo"/>
    </BaseIssuesPageTemplate>
</template>

<script>
    import {BaseIssuesPageMixin} from '../components'
    import {mapActions, mapState} from "vuex";
    import {
        ACTION_HOME_REQUEST_ISSUES_ASSIGNED
    } from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.issue.assigned.loading,
                data: state => state.home.issue.assigned.nodes,
                pageInfo: state => state.home.issue.assigned.pageInfo,
                totalCount: state => state.home.issue.assigned.totalCount,
                currentPage: state => state.home.issue.assigned.currentPage,
                perPage: state => state.home.issue.assigned.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "issue",
                meta: "assigned"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "issue",
                    meta: "assigned",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>