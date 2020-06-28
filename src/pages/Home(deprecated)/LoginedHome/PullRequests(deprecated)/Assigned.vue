<template>
    <IssuesPageTemplate :data="data"
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
    </IssuesPageTemplate>
</template>

<script>
    import {IssuesPageMixin} from '../../../../components'
    import {mapActions, mapState} from "vuex";
    export default {
        mixins: [IssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.pullRequest.assigned.loading,
                data: state => state.home.pullRequest.assigned.nodes,
                pageInfo: state => state.home.pullRequest.assigned.pageInfo,
                totalCount: state => state.home.pullRequest.assigned.totalCount,
                currentPage: state => state.home.pullRequest.assigned.currentPage,
                perPage: state => state.home.pullRequest.assigned.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "pullRequest",
                meta: "assigned"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "pullRequest",
                    meta: "assigned",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>