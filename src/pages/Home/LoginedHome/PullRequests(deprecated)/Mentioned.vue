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
                loading: state => state.home.pullRequest.mentioned.loading,
                data: state => state.home.pullRequest.mentioned.nodes,
                pageInfo: state => state.home.pullRequest.mentioned.pageInfo,
                totalCount: state => state.home.pullRequest.mentioned.totalCount,
                currentPage: state => state.home.pullRequest.mentioned.currentPage,
                perPage: state => state.home.pullRequest.mentioned.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "pullRequest",
                meta: "mentioned"
            })
        },
        methods: {
            pagination_getData(payload){
                this.action_getData({
                    issueType: "pullRequest",
                    meta: "mentioned",
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>