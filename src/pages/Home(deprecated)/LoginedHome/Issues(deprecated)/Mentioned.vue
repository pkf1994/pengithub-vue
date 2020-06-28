<template>
    <IssuesPageTemplate :data="data"
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
    </IssuesPageTemplate>
</template>

<script>
    import {IssuesPageMixin} from '../../../../components'
    import {mapActions, mapState} from "vuex";
    export default {
        mixins: [IssuesPageMixin],
        computed: {
            ...mapState({
                loading: state => state.home.issue.mentioned.loading,
                data: state => state.home.issue.mentioned.nodes,
                pageInfo: state => state.home.issue.mentioned.pageInfo,
                totalCount: state => state.home.issue.mentioned.totalCount,
                currentPage: state => state.home.issue.mentioned.currentPage,
                perPage: state => state.home.issue.mentioned.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "issue",
                meta: "mentioned"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "issue",
                    meta: "mentioned",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>