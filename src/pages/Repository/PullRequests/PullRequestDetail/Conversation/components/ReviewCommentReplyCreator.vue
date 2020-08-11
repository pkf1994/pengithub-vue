<template>
    <Container class="container">
        <textarea ref="textarea" v-model="content" class="form-control" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
        <div class="text-right">
            <button class="btn mt-2" @click="() => $emit('cancel')" :disabled="loading">Cancel</button>
            <button class="btn mt-2 ml-1 btn-primary" @click="network_addReply" :disabled="loading">{{loading ? 'Trying...' : 'Add reply'}}</button>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost} from '@/network'
    import  * as api from '@/network/api'
    export default {
        props: {
            commentId: [String,Number]
        },
        data() {
            return {
                content: '',
                loading: false
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
        },
        mounted() {
            this.$refs.textarea.focus()
        },
        activated() {
            this.$refs.textarea.focus()
        },
        methods: {
            async network_addReply() {
                try {
                    this.loading = true
                    let url = api.API_CREATE_REVIEW_REPLY({
                        repo: this.repo,
                        owner: this.owner,
                        number: this.number,
                        commentId: this.commentId
                    })
                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.content
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.v3+json"
                            }
                        }
                    )

                    this.$emit('reply-success',res.data)
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.container{
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>