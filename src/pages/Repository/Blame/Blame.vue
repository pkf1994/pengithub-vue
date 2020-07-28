<template>
    <WithSignInNoticeWrapper  ref="signInNotice" class="px-3">
        <CommonLoadingWrapper :loading="loading || allBranchesAndTags.loading">
            <FilePath class="file-path text-normal my-2 flex-auto text-bold">
                <router-link :to="`/${owner()}/${repo()}`">{{repo()}}</router-link>&nbsp;/&nbsp;<Breadcrumb :disableLastFragment="true" :spaceArround="true" :routePath="breadcrumbRouterPath" :displayPath="path && path.replace(/^\//,'').replace(/\/$/,'')"/>
            </FilePath>

            <transition name="fade" appear>
                <ComplexBubble :delay="2000" v-if="data.length > 0">
                    <template v-slot:title>
                        <AnimatedHeightWrapper>
                            <Header class="Box-header py-2 d-flex flex-column flex-shrink-0">
                                <Pane class="d-flex py-1 py-md-0 flex-auto flex-justify-between">
                                    <BtnGroup class="BtnGroup">
                                        <a v-if="!file.isBinary" :href="raw" class="btn btn-sm BtnGroup-item">
                                            Raw
                                        </a>
                                        <router-link v-if="!file.isBinary" :to='normalViewRouterLink' class="btn btn-sm BtnGroup-item">
                                            Normal view
                                        </router-link>
                                        <router-link :to='historyRouterLink' class="btn btn-sm BtnGroup-item">
                                            History
                                        </router-link>
                                    </BtnGroup>
                                </Pane>
                                <LineAndSize  class="text-mono f6 flex-auto pt-2 text-normal">
                                    <Legend class="float-right">
                                        <span>Newer</span>
                                        <ol class="d-inline-block mx-1 list-style-none">
                                            <li class="heat d-inline-block" data-heat="1"></li>
                                            <li class="heat d-inline-block" data-heat="2"></li>
                                            <li class="heat d-inline-block" data-heat="3"></li>
                                            <li class="heat d-inline-block" data-heat="4"></li>
                                            <li class="heat d-inline-block" data-heat="5"></li>
                                            <li class="heat d-inline-block" data-heat="6"></li>
                                            <li class="heat d-inline-block" data-heat="7"></li>
                                            <li class="heat d-inline-block" data-heat="8"></li>
                                            <li class="heat d-inline-block" data-heat="9"></li>
                                            <li class="heat d-inline-block" data-heat="10"></li>
                                        </ol>
                                        <span>Older</span>
                                    </Legend>
                                </LineAndSize>

                                
                            </Header>
                        </AnimatedHeightWrapper>
                        
                    </template>

                    <BlameItem v-for="item in data" :key="`${item.commit.id}-${item.startingLine}-${item.endingLine}`" :blameItem="item">
                    </BlameItem>

                </ComplexBubble>
            </transition>
        </CommonLoadingWrapper>
    </WithSignInNoticeWrapper>
</template>

<script>
    import {CommonLoadingWrapper,WithSignInNoticeWrapper,Breadcrumb,ComplexBubble,AnimatedHeightWrapper} from '@/components'
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {WithRefDistinguishMixin} from '../components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import BlameItem from './BlameItem'
    export default {
        name: 'repository_blame_page',
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin,WithRefDistinguishMixin],
        data() {
            return {
                data: [],
                loading: false,
                allBranchesAndTags: {
                    branches: [],
                    tags: [],
                    loading: false
                },
                file: {
                    isBinary: false,
                    byteSize: 0,
                    loading: false
                }
            }
        },
        computed: {
            breadcrumbRouterPath() {
                return `/${this.owner()}/${this.repo()}/tree${this.path}`
            },
            raw() {
                let pathFragment = this.$route.params.pathMatch
                return `https://raw.githubusercontent.com/${this.owner()}/${this.repo()}/${pathFragment}`
            },
            historyRouterLink() {
                return `/${this.owner()}/${this.repo()}/commits/${this.currentRef}/${this.path}`
            },
            fileRowCount() {
                return 0
            },
            normalViewRouterLink() {
                return `/${this.owner()}/${this.repo()}/blob/${this.currentRef}/${this.path}`
            }
        },
        async mounted() {
            if(!this.accessToken) {
                this.$refs.signInNotice.show()
            }else{
                await this.network_getAllBranchesAndTags()
                this.network_getData() 
            }
        },
        methods: {
            network_getData() {
                if(!this.path || this.path.trim() == '') {
                    this.emitNotFoundEvent(this.$refs.signInNotice.$el)
                    return
                }
                this.network_getBlameRanges()
                this.network_getFile()
            },
            async network_getFile() {
                 try{
                    this.file.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_file')
                    let graphql_file = graphql.GRAPHQL_FILE
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_file,
                        {
                            cancelToken,
                            variables: {
                                "name": this.repo(),
                                "owner": this.owner(),
                                "expression": `${this.currentRef}:${this.path.replace(/^\//,'')}`
                            }
                        })
                    try{
                        this.file.isBinary = res.data.data.repository.object.isBinary
                        this.file.byteSize = res.data.data.repository.object.byteSize
                        this.file.text = res.data.data.repository.object.text
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.file.loading = false
                }
            },
            async network_getBlameRanges() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_blame = graphql.GRAPHQL_BLAME
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_blame,
                        {
                            cancelToken,
                            variables: {
                                "name": this.repo(),
                                "owner": this.owner(),
                                "path": this.path.replace(/^\//,''),
                                "expression": this.currentRef
                            }
                        })

                    try{
                        this.data = res.data.data.repository.object.blame.ranges
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    if(this.data.length == 0) {
                        this.emitNotFoundEvent(this.$refs.signInNotice.$el)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            CommonLoadingWrapper,
            Breadcrumb,
            WithSignInNoticeWrapper,
            ComplexBubble,
            AnimatedHeightWrapper,
            BlameItem,
            Container: styled.div``,
            FilePath: styled.div``,
            Content: styled.div``,
            Pane: styled.div``,
            LineAndSize: styled.div``,
            BtnGroup: styled.div``,
            Header: styled.div``,
            Legend: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.file-path {
    font-size: 16px;
    color: #586069;
}
.heat {
    width: 2px;
    height: 10px;
    margin: 2px 1px 0;
}
.heat[data-heat="1"] {
    background: #f66a0a;
}
.heat[data-heat="2"] {
    background: rgba(246,106,10,.9);
}
.heat[data-heat="3"] {
    background: rgba(246,106,10,.8);
}
.heat[data-heat="4"] {
    background: rgba(246,106,10,.7);
}
.heat[data-heat="5"] {
    background: rgba(246,106,10,.6);
}
.heat[data-heat="6"] {
    background: rgba(246,106,10,.5);
}
.heat[data-heat="7"] {
    background: rgba(246,106,10,.4);
}
.heat[data-heat="8"] {
    background: rgba(246,106,10,.3);
}
.heat[data-heat="9"] {
    background: rgba(246,106,10,.2);
}
.heat[data-heat="10"] {
    background: rgba(246,106,10,.1);
}
</style>