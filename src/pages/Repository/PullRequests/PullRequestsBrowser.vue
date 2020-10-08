<template>
    <IssuesBrowser ref="issueBrowser" type="pr" routerPathFragment="pulls" :routerLinkToNew="`/${owner}/${repo}/compare`">
        <template v-slot:emptyNotice>
            <div class="blankslate blankslate-spacious blankslate-large border-0">
                <div class="container-md">
                    <svg height="40" class="octicon octicon-git-pull-request blankslate-icon" viewBox="0 0 24 24" version="1.1" width="40" aria-hidden="true"><path fill-rule="evenodd" d="M4.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 4.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM4.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm17.75-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM16 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"></path><path fill-rule="evenodd" d="M4.75 7.25A.75.75 0 015.5 8v8A.75.75 0 014 16V8a.75.75 0 01.75-.75zm8.655-5.53a.75.75 0 010 1.06L12.185 4h4.065A3.75 3.75 0 0120 7.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0z"></path></svg>
                    <h3>Welcome to pull requests!</h3>
                    <p>Pull requests help you collaborate on code with other people. As pull requests are created, they’ll appear here in a searchable and filterable list. To get started, you should <router-link :to="`/${owner}/${repo}/compare`">create a pull request</router-link>.</p>
                </div>
            </div>
        </template>
        <template v-slot:noResultMatchedNotice>
            <div class="blankslate blankslate-spacious blankslate-large border-0 rounded-top-0">
                <div class="container-md">
                    <svg height="40" class="octicon octicon-git-pull-request blankslate-icon" viewBox="0 0 24 24" version="1.1" width="40" aria-hidden="true"><path fill-rule="evenodd" d="M4.75 3a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 4.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM4.75 17.5a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM1.5 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm17.75-1.75a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zM16 19.25a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"></path><path fill-rule="evenodd" d="M4.75 7.25A.75.75 0 015.5 8v8A.75.75 0 014 16V8a.75.75 0 01.75-.75zm8.655-5.53a.75.75 0 010 1.06L12.185 4h4.065A3.75 3.75 0 0120 7.75v8.75a.75.75 0 01-1.5 0V7.75a2.25 2.25 0 00-2.25-2.25h-4.064l1.22 1.22a.75.75 0 01-1.061 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0z"></path></svg>
                    <h3>No results matched your search.</h3>
                    <p>You could search <router-link to="/search">all of GitHub</router-link>.</p>
                </div>
            </div>
        </template>
    </IssuesBrowser>
</template>

<script>
    import styled from 'vue-styled-components'
    import {cancelAndUpdateAxiosCancelTokenSource,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    var parse = require('parse-link-header');
    import {mapState} from 'vuex'
     import {RouteUpdateAwareMixin} from '@/mixins'
    import IssuesBrowser from '../Issues/IssuesBrowser.vue'
    export default {
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                watchRouterMeta: false
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        components: {
            IssuesBrowser
        },
        methods: {
            routeUpdateHook() {
                this.$refs.issueBrowser.network_getData()
            },
            routeResetHook() {
                Object.assign(this.$refs.issueBrowser.$data, this.$refs.issueBrowser.$options.data())
            }
        },
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/blankslate/index.scss';
</style>