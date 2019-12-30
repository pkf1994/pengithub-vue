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
    import {ACTION_HOME_REQUEST_ISSUES_CREATED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.issue.created.loading,
                data: state => state.home.issue.created.nodes,
                pageInfo: state => state.home.issue.created.pageInfo,
                totalCount: state => state.home.issue.created.totalCount,
                currentPage: state => state.home.issue.created.currentPage,
                perPage: state => state.home.issue.created.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "issue",
                meta: "created"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "issue",
                    meta: "created",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>