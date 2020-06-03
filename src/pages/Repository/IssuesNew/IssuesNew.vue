<template>
    <CommonLoadingWrapper :loading="loading" class="p-3">
        <input class="form-control input-lg input-block input-contrast mb-3" v-modal="title" required="required" autofocus="autofocus" autocomplete="off" placeholder="Title" aria-label="Title" type="text" name="issue[title]" id="issue_title">
        <Editor :textareaStyle="{
                    height: '200px',
                    minHeight: '200px',}">
                    <span></span>
        </Editor>

        <button type="submit" class="btn btn-primary btn-block d-md-none mt-5" data-disable-invalid="" data-disable-with="" disabled="">
            Submit new issue
        </button>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,Editor} from '@/components'
    export default {
        name: 'repository_issue_new_page',
        inject: ['owner','repo'],
        data() {
            return {
                title: '',
                loading: false
            }
        },
        computed: {
            documentTitle() {
                return `New Issue · ${this.owner()}/${this.repo()}`
            }
        },
        components: {
            CommonLoadingWrapper,
            Editor,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
</style>