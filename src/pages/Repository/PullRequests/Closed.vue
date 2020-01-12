<template>
    <IssuesPageTemplate :data="data"
                        :loading="loading"
                        :noDataFlag="noData"
                        :showRepoFullName="false"
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
    import {IssuesPageMixin} from '../../../components'
     import {
        ACTION_REPOSITORY_REQUEST_ISSUES
    } from "../../../store/modules/repository/actionTypes";
    import {mapActions, mapState} from "vuex";
    export default {
        mixins: [IssuesPageMixin],
        inject: ['owner','repo'],
        computed: {
            ...mapState({
                loading: state => state.repository.pullRequest.closed.loading,
                data: state => state.repository.pullRequest.closed.nodes,
                pageInfo: state => state.repository.pullRequest.closed.pageInfo,
                totalCount: state => state.repository.pullRequest.closed.totalCount,
                currentPage: state => state.repository.pullRequest.closed.currentPage,
                perPage: state => state.repository.pullRequest.closed.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "pullRequest",
                state: "closed",
                owner: this.owner,
                repo: this.repo
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_ISSUES
            }),
            pagination_getData(payload){
                this.action_getData({
                    issueType: "pullRequest",
                    state: "closed",
                    owner: this.owner,
                    repo: this.repo,
                    ...payload
                })
            }
        }
    }
</script>

<style scoped>

</style>