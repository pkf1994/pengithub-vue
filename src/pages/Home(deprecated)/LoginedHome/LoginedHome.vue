<template>
    <Container class="flex-column">
        <HeaderDetachTopTab :tabs="tabs"></HeaderDetachTopTab>
        <Dashboard></Dashboard>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        LogoHeader,
        Button,
        HeaderDetachTopTab,
    } from '@/components'
    import Dashboard from "./Dashboard/Dashboard.vue";
    import {mapActions, mapState} from "vuex";
    import {
        ACTION_HOME_REQUEST_NOTIFICATIONS_DATA
    } from "@/store/modules/home/actionTypes";
    const TAB_DASHBOARD = "Dashboard"
    const TAB_PULL_REQUESTS = "Pull requests"
    const TAB_ISSUES = "Issues"

    export default {
        data() {
            return {
                tabs: [
                    {
                        label: "Dashboard",
                        exact: true,
                        routerLink: '/'
                    },
                    {
                        label: "Pull requests",
                        routerLink: '/pulls'
                    },
                    {
                        label: "Issues",
                        routerLink: '/issues'
                    }
                ],
            }
        },
        created(){
            //this.action_home_requestNotificationsData()
        },
        methods: {
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