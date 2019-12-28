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
                    :dataGetter="action_getData"
                    :pageInfo="pageInfo"/>
    </BaseIssuesPageTemplate>
</template>

<script>
    import {BaseIssuesPageMixin} from '../components'
    import {mapActions, mapState} from "vuex";
    import {ACTION_HOME_REQUEST_ISSUES_MENTIONED} from "../../../../store/modules/home/actionTypes";
    export default {
        mixins: [BaseIssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.issues.mentioned.loading,
                data: state => state.home.issues.mentioned.nodes,
                pageInfo: state => state.home.issues.mentioned.pageInfo,
                totalCount: state => state.home.issues.mentioned.totalCount,
                currentPage: state => state.home.issues.mentioned.currentPage,
                perPage: state => state.home.issues.mentioned.perPage
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_HOME_REQUEST_ISSUES_MENTIONED
            })
        }
    }
</script>

<style scoped>

</style>