<template> 
    <Container class="bubble m-0 bg-white">
        <HideAndShowPane v-if="propsData.isMinimized" class="p-3 d-flex flex-justify-between p-3 text-gray text-small border-bottom">
            <span class="text-italic">
                This comment was marked as {{propsData.minimizedReason}}.
            </span>

            <button class="btn-link text-gray" @click="triggerShowMinimized">
                <svg class="octicon octicon-fold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                    {{showMinimized ? 'Hide' : 'Show'}}
            </button>
        </HideAndShowPane>
        <AnimatedHeightWrapper :stretch="showMinimized || !propsData.isMinimized">
            <Header class="header " :style="headerStyle">
                <Action class="float-right mt-2 ml-2">
                    <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                </Action>
                
                <Avatar class="float-left relative">
                    <img class="avatar" height="32" width="32" :alt="`@${propsData.author && propsData.author.login}`" :src="propsData.author && propsData.author.avatarUrl">
                </Avatar>
                
                <Meta class="meta">
                    <router-link :to="`/${propsData.author && propsData.author.login}`">
                        {{propsData.author.login}}
                    </router-link><br v-if="!withEditHistory">
                    commented
                </Meta>

            </Header>

            <Body class="pb-2 p-3" v-if="propsData.bodyHTML">
                <BodyHTML v-html="propsData.bodyHTML"  class="markdown-body f5 p-0">

                </BodyHTML>

                <Reaction   v-if="(propsData.viewerCanReact || withReaction) && !propsData.isMinimized" 
                            :data="propsData" 
                            :disabled="!propsData.viewerCanReact"></Reaction>
            </Body>

            <LoadingWrapper v-if="!propsData.id" class="loading-wrapper flex flex-justify-center flex-items-center">
                <LoadingIconEx/>
            </LoadingWrapper>
             
        </AnimatedHeightWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '@/util'
    import {LoadingIconEx,AnimatedHeightWrapper,Popover} from '@/components'
    import ClipboardJS from 'clipboard';
    import Reaction from '../Reaction'
    export default {
        data() {
            return {
                showMinimized: false,
                popoverStyle: {
                    top: '100%',
                    right: '-6px'
                }
            }
        },
        props: {
            propsData: {
                type: Object,
                default: () => ({})
            },
            headerStyle: {
                type: Object,
                required: false
            }
        },
        computed: {
            createdAt() {
                return util_dateFormat.getDateDiff(this.propsData.created_at)
            },
            editedAt() {
                if(!this.propsData.userContentEdits.nodes || !this.propsData.userContentEdits.nodes[0]) return
                return util_dateFormat.getDateDiff(this.propsData.userContentEdits.nodes[0].editedAt)
            },
            withReaction() {
                 for(let key in this.propsData) {
                    switch(key) {
                        case 'THUMBS_UP':
                        case 'THUMBS_DOWN':
                        case 'LAUGH':
                        case 'HOORAY':
                        case 'CONFUSED':
                        case 'HEART':
                        case 'ROCKET':
                        case 'EYES':
                            if(this.propsData[key].totalCount > 0) return true
                            if(this.propsData[key] > 0) return true
                            break
                        default:
                    }
                }
                return false
            },
            withEditHistory() {
                return this.propsData.userContentEdits && this.propsData.userContentEdits.totalCount > 0
            },
            location() {
                return location
            }
        },
        methods: {
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
            showActionPopover() {
                this.$refs.actionPopover.show = true
            },
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Popover,
            Reaction,
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
            HideAndShowPane: styled.div``
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