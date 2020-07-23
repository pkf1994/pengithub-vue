<template>
    <Container>
        <PageTopTab :tabs="tabs" style="margin-top: -32px;"></PageTopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PageTopTab} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {
        authRequiredGet,
        cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    export default {
        name: 'pr_detail',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                number:() => this.number,
                pullRequestProvided: () => this.data,
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                isDynamicDocumentTitle: true
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            tabs() {
                let basePath = `/${this.owner}/${this.repo}/pull/${this.number}`
              return [
                    { 
                        label: 'Conversation',
                        to: `${basePath}`
                    },
                    { 
                        label: 'Commits',
                        to: `${basePath}/commits`
                    },
                    { 
                        label: 'Changes',
                        to: `${basePath}/files`
                    },
                ]
            },

            documentTitle() {
                if(!this.data.title) return location.href
                return `${this.data.title} by ${this.data.user.login} · Pull Request #${this.data.number} · ${this.owner}/${this.repo}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
             async network_getData() {
                try{
                    let sourceAndCancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    //获取基本数据
                    this.loading = true
                    let url_pullRequest = api.API_PULLREQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number
                    })
                    let res_pullRequest = await authRequiredGet(url_pullRequest,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.data = res_pullRequest.data
                }catch(e){
                   this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
        },
        components: {
            PageTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">

</style>