<template>
    <BaseIssuesPageTemplate :data="data"
                            :loading="loading"
                            :noDataFlag="noData"
                            type="issue"
                            noDataMsg="No issue to show">
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
    import {ACTION_HOME_REQUEST_ISSUES_CREATED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.issues.created.loading,
                data: state => state.home.issues.created.nodes,
                pageInfo: state => state.home.issues.created.pageInfo,
                totalCount: state => state.home.issues.created.totalCount,
                currentPage: state => state.home.issues.created.currentPage,
                perPage: state => state.home.issues.created.perPage
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_ISSUES_CREATED
            }),
        }
    }
</script>

<style scoped>

</style>