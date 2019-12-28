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
                    :dataGetter="action_getData"
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
                loading: state => state.home.pullRequests.created.loading,
                data: state => state.home.pullRequests.created.nodes,
                pageInfo: state => state.home.pullRequests.created.pageInfo,
                totalCount: state => state.home.pullRequests.created.totalCount,
                currentPage: state => state.home.pullRequests.created.currentPage,
                perPage: state => state.home.pullRequests.created.perPage
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_PULL_REQUESTS_CREATED
            })
        }
    }
</script>

<style scoped>

</style>