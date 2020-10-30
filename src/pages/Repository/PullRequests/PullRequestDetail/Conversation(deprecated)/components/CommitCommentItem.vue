<template> 
    <Container class="bubble m-0 bg-white">
        <HideAndShowPane v-if="extraData.isMinimized" class="p-3 d-flex flex-justify-between p-3 text-gray text-small">
            <span class="text-italic">
                This comment was marked as {{extraData.minimizedReason}}.
            </span>

            <button class="btn-link text-gray">
                <svg class="octicon octicon-fold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                    {{showMinimized ? 'Hide' : 'Show'}}
            </button>
        </HideAndShowPane>
        <AnimatedHeightWrapper :stretch="showMinimized || !extraData.isMinimized">
          <!--   <Header class="header " :style="headerStyle">
                <Action class="float-right mt-2 ml-2">
                    <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                </Action>
                
                <Avatar class="float-left relative">
                    <img class="avatar" height="32" width="32" :alt="`@${data.user && data.user.login}`" :src="data.user && data.user.avatar_url">
                </Avatar>
                
                <Meta class="meta">
                    <router-link :to="`/${data.user && data.user.login}`">
                        {{data.user.login}}
                    </router-link><br v-if="!withEditHistory">
                    commented {{data.created_at | getDateDiff}}
                    <span v-if="withEditHistory"> • edited {{editedAt}}</span>    
                </Meta>

            </Header> -->

            <WhoDidWhatAt class="d-flex flex-row px-3 pt-3"  :class="{'minimized-header  pl-5':extraData.isMinimized}">
                <div class="flex-auto flex flex-items-center">
                    <router-link :to="`/${data.user.login}`" class="d-inline-block">
                        <ImgWrapper>
                            <img class="v-align-middle" :src="data.user.avatar_url" :alt="`@${data.user.login}`" width="16" height="16">&nbsp;
                        </ImgWrapper>
                    </router-link>
                    <router-link :to="`/${data.user.login}`" class="f5 text-bold link-gray-dark">{{data.user.login}}</router-link>
                    <span class="text-gray">&nbsp;• {{data.created_at | getDateDiff}}</span>
                </div>

                <div class="ml-2 btn-link height-full muted-link">
                    <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                </div>
            </WhoDidWhatAt>

            <Body class="pt-2 px-3 pb-2" :class="{'pb-3 pl-5':extraData.isMinimized}">
                <BodyHTML v-html="bodyHTML"  class="markdown-body f5 p-0">

                </BodyHTML>

                <Reactions  :data="reactions.data" 
                            :disabled="!extraData.viewerCanReact"></Reactions>
            </Body>

        </AnimatedHeightWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_markdownParse} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover,ImgWrapper} from '@/components'
    import ClipboardJS from 'clipboard';
    import {Reactions} from '../../components'
    import Comment from './Comment'
    import { authRequiredGet } from '@/network';
    export default {
        inject: ['commitCommentExtraData'],
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
            data: {
                type: Object,
                required: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            headerStyle: {
                type: Object,
                required: false
            }
        },
        computed: {
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.data.body)
            },
            extraData() {
                return this.commitCommentExtraData().filter(i => i.id == this.data.node_id)
            }
        },
        methods: {
            async network_getReactions() {
                try {
                    this.reactions.loading = true
                    let res = await authRequiredGet(
                        this.data.url,
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )
                    this.reactions.data = res.data.reactions
                } catch (e) {
                    console.log(e)
                } finally {
                    this.reactions.loading = false
                }
            },
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            Reactions,
            ImgWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            Avatar: styled.div``,
            Meta: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Main: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            Action: styled.div``,
            AuthorAssociation: styled.span``,
            StretchCommentBtn: styled.div``,
            HideAndShowPane: styled.div``,
            WhoDidWhatAt: styled.div``,
        }
    }
</script>

<style lang="scss">
.user-mention {
    font-weight: 600;
    color: #24292e;
}
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

.minimized-header{
    padding-top: 0px !important;
}

.minimized-body{
    padding-bottom: 0px !important;
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