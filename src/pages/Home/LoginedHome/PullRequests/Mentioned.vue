<template>
    <BaseIssuesPageTemplate :data="data"
                            :loading="loading"
                            :noDataFlag="noData"
                            type="pullRequest"
                            noDataMsg="No pull request to show">
        <Pagination v-if="showPagination"
                    :totalCount="totalCount"
                    :loading="loading"
                    :perPage="perPage"
                    :currentPage="currentPage"
                    :dataGetter="action_getData"
                    :pageInfo="pageInfo"/>
    </BaseIssuesPageTemplate>
</template>

<script>
    import {BaseIssuesPageMixin} from '../components'
    import {mapActions, mapState} from "vuex";
    import {ACTION_HOME_REQUEST_PULL_REQUESTS_MENTIONED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.pullRequests.mentioned.loading,
                data: state => state.home.pullRequests.mentioned.nodes,
                pageInfo: state => state.home.pullRequests.mentioned.pageInfo,
                totalCount: state => state.home.pullRequests.mentioned.totalCount,
                currentPage: state => state.home.pullRequests.mentioned.currentPage,
                perPage: state => state.home.pullRequests.mentioned.perPage
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_PULL_REQUESTS_MENTIONED
            })
        }
    }
</script>

<style scoped>

</style>