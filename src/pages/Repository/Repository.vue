<template>
    <Container class="container flex-column">
        <HeaderDetachTopTab :tabs="tabs" :activeTab="activeTab"></HeaderDetachTopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions } from 'vuex'
    import {HeaderDetachTopTab} from '../../components'
    import { ACTION_REPOSITORY_REQUEST_BASIC_DATA } from '../../store/modules/repository/actionTypes'
    const TAB_CODE = "Code"
    const TAB_ISSUES = "Issues"
    const TAB_PULLS = "Pull requests"
    const TAB_PROJECTS = "Projects"
    const TAB_WIKI = "Wiki"
    const TAB_SECURITY = "Security"
    const TAB_PULSE = "Pulse"
    const TAB_COMMUNITY = "Community"
    export default {
        data() {
            return {
                activeTab: TAB_CODE
            }
        },
        provide() {
            return {
                owner: this.owner,
                repo: this.repo
            }
        },
        computed: {
            ...mapState({
                topTabCountData: state => state.repository.basic.data
            }),
            owner: function() {
                return this.$attrs.owner
            },
            repo: function() {
                return this.$attrs.repo
            },
            tabs: function() {
                let path = `/${this.owner}/${this.repo}`
                return [
                    {
                        label: TAB_CODE,
                        routerLink: path,
                        exact: true,
                        extraActiveRouterLinks: [
                            `${path}/tree`,
                            `${path}/blob`,
                        ]
                    },
                    {
                        label: TAB_ISSUES,
                        routerLink: `${path}/issues`,
                        disable: !this.topTabCountData.hasIssuesEnabled,
                        meta: this.topTabCountData.issues && this.topTabCountData.issues.totalCount
                    },
                    {
                        label: TAB_PULLS,
                        routerLink: `${path}/pulls`,
                         meta: this.topTabCountData.pullRequests && this.topTabCountData.pullRequests.totalCount
                    },
                    {
                        label: TAB_PROJECTS,
                        routerLink: `${path}/projects`,
                        disable: !this.topTabCountData.hasProjectsEnabled,
                         meta: this.topTabCountData.projects && this.topTabCountData.projects.totalCount
                    },
                    {
                        label: TAB_PULSE,
                        routerLink: `${path}/pulse`
                    },
                    {
                        label: TAB_COMMUNITY,
                        routerLink: `${path}/community`
                    }
                ]
            }
        },
        created() {
            this.action_getBasicData({
                owner: this.owner,
                repo: this.repo
            })
        },
        methods: {
            ...mapActions({
                action_getBasicData: ACTION_REPOSITORY_REQUEST_BASIC_DATA
            })
        },
        components: {
            HeaderDetachTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>