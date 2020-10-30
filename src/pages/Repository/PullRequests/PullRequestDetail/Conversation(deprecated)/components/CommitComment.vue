<template>
    <Container class="p-3 relative container">
        <Main class="main">
             <Header class="header">
                commented on <code>
                    <router-link :to="commitRouteLink">{{commitComment.commit_id.substring(0,7)}}</router-link>  
                </code>
            </Header>

            <transition-group name="fade" appear>
                <CommitCommentItem v-for="item in commitComment.comments" :key="item.id" :data="item" style="border:none"/>
            </transition-group>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Popover} from '@/components'
    import CommitCommentItem from './CommitCommentItem'
    import { authRequiredGitHubGraphqlApiQuery } from '@/network'
    import * as graphql from '../../graphql'
    export default {
        provide() {
            return {
                commitCommentExtraData: () => this.extraData.data
            }
        },
        props: {
            commitComment: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            commitRouteLink() {
                let routeLink = this.commitComment.comments[0].html_url.replace('https://github.com','').replace(/#.*$/g,'')
                return routeLink
            }
        },
        created() {
            this.network_getCommitCommentsExtraData()
        },
        methods: {
            async network_getCommitCommentsExtraData() {
                if(this.commitComment.comments.length == 0) return
                try{
                    this.extraData.loading = true


                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_COMMIT_COMMENT,
                        {
                            variables: {
                                ids: this.commitComment.comments.map(i => i.node_id)
                            }
                        }
                    )

                    try{
                        this.extraData.data =  res.data.data.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            }
        },
        components: {
            CommitCommentItem,
            Container: styled.div``,
            Main: styled.div``,
            Header: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.container{
    padding: 15px;
    font-size: 13px;
    color: #586069;
}

.main{
    border: 1px solid #d1d5da;
    border-radius: 3px;
}

.header{
    position: relative;
    padding: 7.5px 15px;
    font-size: 12px;
    color: #586069;
    border-bottom: 1px solid #dfe2e5;
}

.header:before {
    bottom: -8px;
    left: 15px;
    z-index: 10;
    border-top: 8px solid #dfe2e5;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    position: absolute;
    width: 0;
    height: 0;
    content: "",
}

.header:after {
    bottom: -7px;
    left: 16px;
    z-index: 20;
    border-top: 7px solid #fff;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    position: absolute;
    width: 0;
    height: 0;
    content: "";
}

.loading-wrapper{
    height: 120px;
}

</style>