<template>
    <IssuesPageTemplate :data="data"
                        :loading="loading"
                        :loadingAdditionalData="loadingAdditionalData"
                        :noDataFlag="noData"
                        :showRepoFullName="false"
                        type="issue"
                        noDataMsg="No issue to show">
        <IconPagination v-if="showPagination"
                    :totalCount="totalCount"
                    :loading="loading"
                    :perPage="perPage"
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
                loading: state => state.repository.issues.open.loading,
                loadingAdditionalData: state => state.repository.issues.open.loadingAdditionalData,
                data: state => state.repository.issues.open.data,
                pageInfo: state => state.repository.issues.open.pageInfo,
                totalCount: state => state.repository.issues.open.totalCount,
                perPage: state => state.repository.issues.open.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "issues",
                meta: "open",
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
                    issueType: "issues",
                    meta: "open",
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