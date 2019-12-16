<template>
    <Container class="col-12">
        <Header></Header>
        <TopTab :tabs="tabs" :activeTab="activeTab"></TopTab>
        <router-view/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        Header,
        Button,
        TopTab
    } from '../../../../components'
    import {
        Dashboard,
        PullRequests,
        Issues
    } from './components'
    import {mapActions, mapState} from "vuex";
    import {ACTION_USER_REQUEST_USER_INFO} from "../../../../store/modules/user/actionTypes";
    const TAB_DASHBOARD = "Dashboard"
    const TAB_PULL_REQUESTS = "Pull requests"
    const TAB_ISSUES = "Issues"

    export default {
        data() {
            return {
                tabs: [
                    {
                        label: TAB_DASHBOARD,
                        routerLink: '/'
                    },
                    {
                        label: TAB_PULL_REQUESTS,
                        routerLink: 'pulls'
                    },
                    {
                        label: TAB_ISSUES,
                        routerLink: 'issues'
                    }
                ],
                activeTab: TAB_DASHBOARD
            }
        },
        created(){
            this.action_user_requestUserInfo()
        },
        computed: {

            activeComponent() {
                return this.activeTab === TAB_PULL_REQUESTS ? "PullRequests" : this.activeTab
            }
        },
        methods: {
            ...mapActions({
                action_user_requestUserInfo: ACTION_USER_REQUEST_USER_INFO
            }),
            switchTab(tabItem) {
                this.activeTab = tabItem
            },
            testHttp() {

            }
        },
        components:{
            Header,
            Button,
            TopTab,
            Dashboard,
            PullRequests,
            Issues,
            Container: styled.div``,
            Main: styled.div``
        }
    }
</script>

<style scoped>

</style>