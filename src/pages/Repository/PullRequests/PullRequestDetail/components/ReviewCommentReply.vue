<template> 
    <Container class="px-3 pt-3 pb-2">

        <WhoDidWhatAt class="d-flex flex-row">
            <div class="flex-auto">
                <router-link :to="`/${reply.user.login}`" class="d-inline-block">
                    <ImgWrapper>   
                        <img :src="reply.user.avatar_url" :alt="`@${reply.user.login}`" width="16" height="16">
                    </ImgWrapper>
                </router-link>
                <router-link :to="`/${reply.user.login}`" class="f5 text-bold link-gray-dark">{{reply.user.login}}</router-link> 
                <span class="text-gray"> • {{reply.created_at | getDateDiff}}</span>
            </div>

            <div class="ml-2 btn-link height-full">
                <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
            </div>
        </WhoDidWhatAt>

        <CommentBody v-html="bodyHTML" class="markdown-body p-0 pt-2 f5">
        </CommentBody>

        <Reaction class="mt-2" :data="reactions.data" :disabled="!replyExtraData.viewerCanReact">
        </Reaction>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import {ImgWrapper} from '@/components'
    import Reaction from './Reaction'
    import { authRequiredGet } from '@/network'
    import * as api from '@/network/api'
    export default {
        inject: ['repliesExtraData'],
        data() {
            return {
                reactions: {
                    data: {},
                    loading: false
                },
            }
        },
        props: {
            reply: {
                type: Object,
                required: true
            },
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.reply.body)
            },
            replyExtraData() {
                return this.repliesExtraData().filter(i => i.id == this.reply.node_id)[0] || {}
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getReactions()
            },
            async network_getReactions() {
                try {
                    this.reactions.loading = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.reply.id
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    this.reactions.data = res.data.reactions
                } catch (e) {
                    console.log(e)
                }finally{
                    this.reactions.loading = false
                }
            },
        },
        components: {
            ImgWrapper,
            Reaction,
            Container: styled.div``,
            WhoDidWhatAt: styled.div``,
            CommentBody: styled.div``,
        }
    }
</script>

<style scoped lang="scss">

</style>