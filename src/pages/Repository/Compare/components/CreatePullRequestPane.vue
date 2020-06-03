<template>
    <CommonLoadingWrapper class="container border-top border-bottom py-3" :loading="loading" position="corner">
        <TitleInput>
            <input :disabled="loading" class="form-control input-block input-contrast" placeholder="Title" autofocus="autofocus" autocomplete="off" type="text" v-model="title">
        </TitleInput>
        
        <EditorWrapper class="mt-3">
            <Editor :textareaStyle="{height: '280px'}" v-model="markdownRaw" :disabled="loading">
                <ButtonGroup class="mt-3">
                    <button class="btn btn-primary d-block width-full" :disabled="!title || loading" @click="() => network_submitData(false)">
                        Create pull request
                    </button>
                    <button class="btn btn-primary d-block width-full mt-2" :disabled="!title || loading" @click="() => network_submitData(true)">
                        Create draft pull request
                    </button>
                </ButtonGroup>
            </Editor>
        </EditorWrapper>
    </CommonLoadingWrapper>
</template>
<script>
import styled from 'vue-styled-components'
import {Editor,CommonLoadingWrapper} from '@/components'
import * as api from '@/network/api'
import {authRequiredPost} from '@/network'
export default {
    props: {
        headRefOwner: String,
        headRef: String,
        baseRef: String,
        defaultTitle: String
    },
    data() {
        return {
            title: '',
            draft: false,
            markdownRaw: '',
            loading: false,
            maintainerCanModify: true
        }
    },
    created() {
        this.title = this.defaultTitle
    },
    methods: {
        async network_submitData(isDraft = false) {
            if(this.loading) return 
            try{
                this.loading = true
                let url = api.API_CREATE_PULL_REQUEST(this.$route.params)
                let res = await authRequiredPost(
                    url, 
                    {
                        title: this.title,
                        head: `${(this.headRefOwner && this.headRefOwner != this.$route.params.owner) ? this.headRefOwner + ':' : ''}${this.headRef}`,
                        base: this.baseRef,
                        body: this.markdownRaw,
                        maintainer_can_modify: this.maintainerCanModify,
                        draft: isDraft,
                    }
                )
                let pullRouterLink = res.data.url && res.data.url.replace('https://api.github.com/repos','')
                if(pullRouterLink) this.$router.push(pullRouterLink)
            }catch(e) {
                this.handleError(e)
            }finally{
                this.loading = false
            }
        }
    },
    components: {
        Editor,
        CommonLoadingWrapper,
        Container: styled.div``,
        TitleInput: styled.div``,
        EditorWrapper: styled.div``,
        ButtonGroup: styled.div``,
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';

</style>