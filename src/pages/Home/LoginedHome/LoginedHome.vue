<template>
    <Container class="flex-column">
        <HeaderDetachTopTab :tabs="tabs" :activeTab="activeTab"></HeaderDetachTopTab>
        <keep-alive>
            <router-view class="flex-column flex-grow-1"/>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        LogoHeader,
        Button,
        HeaderDetachTopTab,
    } from '../../../components'
    import Dashboard from "./Dashboard/Dashboard.vue";
    import PullRequests from "./PullRequests";
    import {mapActions, mapState} from "vuex";
    import {
        ACTION_HOME_REQUEST_DASHBOARD_DATA,
        ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
    } from "../../../store/modules/home/actionTypes";
    const TAB_DASHBOARD = "Dashboard"
    const TAB_PULL_REQUESTS = "Pull requests"
    const TAB_ISSUES = "Issues"

    export default {
        data() {
            return {
                tabs: [
                    {
                        label: TAB_DASHBOARD,
                        exact: true,
                        routerLink: '/'
                    },
                    {
                        label: TAB_PULL_REQUESTS,
                        routerLink: '/pulls'
                    },
                    {
                        label: TAB_ISSUES,
                        routerLink: '/issues'
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
            HeaderDetachTopTab,
            LogoHeader,
            Button,
            HeaderDetachTopTab,
            Dashboard,
            PullRequests,
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