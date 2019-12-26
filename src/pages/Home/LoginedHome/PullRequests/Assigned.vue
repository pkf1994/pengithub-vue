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
    import {ACTION_HOME_REQUEST_PULL_REQUESTS_ASSIGNED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.pullRequests.assigned.loading,
                data: state => state.home.pullRequests.assigned.nodes,
                pageInfo: state => state.home.pullRequests.assigned.pageInfo,
                totalCount: state => state.home.pullRequests.assigned.totalCount,
                currentPage: state => state.home.pullRequests.assigned.currentPage,
                perPage: state => state.home.pullRequests.assigned.perPage
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_PULL_REQUESTS_ASSIGNED
            })
        },
    }
</script>

<style scoped>

</style>