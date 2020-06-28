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
                loading: state => state.repository.issues.yours.loading,
                loadingAdditionalData: state => state.repository.issues.yours.loadingAdditionalData,
                data: state => state.repository.issues.yours.data,
                pageInfo: state => state.repository.issues.yours.pageInfo,
                totalCount: state => state.repository.issues.yours.totalCount,
                perPage: state => state.repository.issues.yours.perPage
            })
        },
        created(){
            this.action_getData({
                issueType: "issues",
                meta: "yours",
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
                    meta: "yours",
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