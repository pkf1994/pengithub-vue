<template>
    <Container class="fix-full-scrollable">
        <LogoHeader></LogoHeader>
        <TopTab :tabs="tabs" :activeTab="activeTab"></TopTab>
        <router-view/>
        <Footer class="footer"/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        LogoHeader,
        Button,
        TopTab,
        Footer
    } from '../../../../components'
    import {
        Dashboard,
        PullRequests,
        Issues
    } from './components'
    import {mapActions, mapState} from "vuex";
    import {
        ACTION_HOME_REQUEST_DASHBOARD_DATA,
        ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
    } from "../../../../store/modules/home/actionTypes";
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
            this.action_home_requestNotificationsData()
        },
        computed: {
            activeComponent() {
                return this.activeTab === TAB_PULL_REQUESTS ? "PullRequests" : this.activeTab
            }
        },
        methods: {
            ...mapActions({
                action_home_requestNotificationsData: ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
            }),
            switchTab(tabItem) {
                this.activeTab = tabItem
            },
            testHttp() {

            }
        },
        components:{
            LogoHeader,
            Button,
            TopTab,
            Dashboard,
            PullRequests,
            Issues,
            Footer,
            Container: styled.div``,
            Main: styled.div``,
            FooterWrapper: styled.div``
        }
    }
</script>

<style scoped>
.footer{
    position: sticky;
    top: 100%;
}
</style>