<template>
    <Container class="pb-2 p-3">
        <BodyHTML v-html="pullRequestBodyHTML"  class="markdown-body p-0 mb-3 " style="font-size:15px">

        </BodyHTML>

        <Reactions v-if="extraData.viewerCanReact || reactions.data.total_count > 0" 
                    :data="reactions.data" 
                    :disabled="!extraData.viewerCanReact"></Reactions>
        
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx,AnimatedHeightWrapper} from '@/components'
    import {util_markdownParse} from '@/util'
    import {mapState} from 'vuex'
    import {Reactions} from '../../components'
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    export default {
        inject: ['pullRequestProvided'],
        data() {
            return {
                showMinimized: false,
                popoverStyle: {
                    top: '100%',
                    right: '-6px'
                },
                reactions: {
                    data: {},
                    loading: false
                }
            }
        },
        props: {
            extraData: {
                type: Object,
                required: false
            },
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
            pull() {
                return this.pullRequestProvided()
            },
            pullRequestBodyHTML() {
                return util_markdownParse.markdownToHTML(this.pullRequestProvided().body)
            }
        },
        created() {
            this.network_getPullRequestReactions()
        },
        methods: {
            async network_getPullRequestReactions() {
                try {
                    this.reactions.loading = false

                    let url = api.API_ISSUE({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.pullRequestProvided().number
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview+json"
                            }
                        }
                    )

                    this.reactions.data = res.data.reactions

                } catch (e) {
                    console.log(e)
                } finally {
                    this.reactions.loading = true
                }
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Reactions,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            BodyHTML: styled.div``,
        }
    }
</script>

<style lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
</style>
<style scoped lang="scss">

.header{
    position: relative;
    padding: 10px 15px;
    font-size: 12px;
    line-height: 16px;
    color: #586069;
    background-color: #fff;
    border-bottom: 1px solid #e1e4e8;
    .meta{
        margin-left: 42px;
        a{
            font-weight: 600;
            color: #444d56;
        }
    }
}

.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}


    .loading-wrapper{
        height: 120px;
    }
</style>