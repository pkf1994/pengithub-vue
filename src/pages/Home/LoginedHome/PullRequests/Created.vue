<template>
    <BaseIssuesPageTemplate :data="data"
                            :loading="loading"
                            :noDataFlag="noData"
                            type="pullRequest"
                            noDataMsg="No pull request to show">
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
    import {mapActions,mapState} from "vuex";
    import {ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        data() {
            return {
                noDataMsg: "No pull request to show"
            }
        },
        computed: {
            ...mapState({
                loading: state => state.home.pullRequest.created.loading,
                data: state => state.home.pullRequest.created.nodes,
                pageInfo: state => state.home.pullRequest.created.pageInfo,
                totalCount: state => state.home.pullRequest.created.totalCount,
                currentPage: state => state.home.pullRequest.created.currentPage,
                perPage: state => state.home.pullRequest.created.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "pullRequest",
                meta: "created"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "pullRequest",
                    meta: "created",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>