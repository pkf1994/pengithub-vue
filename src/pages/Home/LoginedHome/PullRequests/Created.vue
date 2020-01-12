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
    import {mapActions,mapState} from "vuex";
    export default {
        mixins: [IssuesPageMixin],
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