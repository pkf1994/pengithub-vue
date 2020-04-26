<template>
    <Container class="py-4 px-3">
        <RowOne class="d-flex flex-justify-between width-full width-md-auto">
            <button class="btn btn-sm select-menu-button">
                <i>Branch:</i>
                <span class="end-with-triangle branch" data-menu-button="">patreon-update…</span>
            </button>

            <button class="btn btn-sm" id="file-detail-copy-btn" :data-clipboard-text="location.href"> 
                Copy path
            </button>
        </RowOne>

        <FilePath class="file-path text-normal my-2 flex-auto text-bold">
            <router-link :to="`/${owner()}/${repo()}`">{{repo()}}</router-link>&nbsp;/&nbsp;<Breadcrumb :spaceArround="true" :routePath="breadcrumbRoutePath" :path="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
        </FilePath>
        
        <ContributionMessage></ContributionMessage> 

        <Content></Content>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb} from '../../../../../components'
    import ClipboardJS from 'clipboard'
    import {ContributionMessage,Content} from './components'
    import {ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB} from '../../../../../store/modules/repository/actionTypes'
    import {mapActions,mapState} from 'vuex'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery,authRequiredGet   } from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from '../../graphql'
    import * as api from '@/network/api'
    import FileBrowser from '../FileBrowser/FileBrowser'
    export default {
        name: 'repository_code_file_detail_page',
        mixins: [RouteUpdateAwareMixin,FileBrowser],
        inject: ['owner','repo','codeBasicInfo'],
        provide() {
            return {
                lastCommit: () => this.lastCommit.data,
                contributors: () => this.contributors.data,
                loading:() => this.loading,
                data:() => this.data,
                html:() => this.html,
                raw:() => this.raw,
            }
        },
        data() {
            return {
                data: '',
                html: '',
                raw: '',
                loading: false,
                lastCommit: {
                    data: {},
                    loading: false
                },
                contributors: {
                    data: [],
                    loading: false
                }
            }
        },
        created() {
           /*  this.action_getBlob({
                owner: this.owner(),
                repo: this.repo(),
                path: this.$route.params.pathMatch,
                branch: this.$route.params.branch
            }) */
            this.network_getData()
        },
        mounted() {
            this.initClipboard()
        },
        computed: {
            /* ...mapState({
                contents: state => state.repository.code.codeFileBrows
            }), */
            location() {
                return location
            },
            breadcrumbRoutePath() {
                let regExp = new RegExp('^(\/[^\/]+\/[^\/]+\/)blob')
                let match = this.$route.path.match(regExp)
                if(match) {
                    return this.$route.path.replace(regExp,`${match[1]}tree`)
                }
            }
        },
        methods: {
            ...mapActions({
                action_getBlob: ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,
            }),
            async network_getData() {
                if(!this.currentBranch){
                    this.loading = true
                    return
                }
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_contentAndLastCommitAndCommitHistory = graphql.GRAPHQL_REPOSITORY_CONTENT_AND_LAST_COMMIT_AND_COMMIT_HISTORY({
                        repo: this.repo(),
                        owner: this.owner(),
                        path: this.path,
                        branch: this.currentBranch,
                    })
                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_contentAndLastCommitAndCommitHistory,{cancelToken:sourceAndCancelToken.cancelToken})

                    this.lastCommit.data = res.data.data.repository.commit.history.nodes[0]
                    
                    //根据提交历史提取contributors
                    let contributors = []
                    res.data.data.repository.commitHistory.history.nodes.forEach(item => {
                        if(!(contributors.some(_item => item.author.user && _item.user && _item.user.login === item.author.user.login)) && item.author.user) {
                            contributors.push(item.author)
                        }
                    })
                    this.contributors.data = contributors

                    if(!res.data.data.repository.content.isBinary) {
                        this.data = res.data.data.repository.content.text
                        //查看是否返回html
                        const url = api.API_CONTENTS({
                            owner: this.owner(),
                            repo: this.repo(),
                            path: this.path,
                            branch: this.currentBranch
                        })
                        const res_html = await authRequiredGet(url,{
                            headers: {
                                "Accept":"application/vnd.github.VERSION.html"
                                 }
                            })
                        if(res_html.status === 200) {
                            this.html = res_html.data
                        }
                    }else{
                        this.raw = `https://github.com/${this.owner()}/${this.repo()}/blob/${this.currentBranch}/${this.path}?raw=true`
                    }

                    this.loading = false
                }catch(e){
                    console.log(e)
                    this.loading = false
                }
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            }
        },
        components: {
            Breadcrumb,
            ContributionMessage,Content,
            Container: styled.div``,
            RowOne: styled.div``,
            CopyPath: styled.div``,
            FilePath: styled.h2``
        }
    }
</script>

<style scoped>
.file-path{
    font-size: 16px;
    color: #586069;
}
.branch{
    display: inline-block;
    max-width: 125px;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>