<template>
    <Container class="py-4 pl-4 position-relative ml-3">
        <span class="discussion-item-icon">
            <slot name="icon">
                <svg class="octicon octicon-lock" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            </slot>
        </span>

        <Title class="mb-3">
            <h4 class="text-normal text-gray lh-condensed my-0 pr-3">
                {{restrictedContributionsCount}}  {{restrictedContributionsCount > 1 ? 'contributions' : 'contribution'}} in private {{restrictedContributionsCount > 1 ? 'repositories' : 'repository'}}
            </h4>   
        </Title>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            restrictedContributionsCount: {
                type: Number,
                required: true,
            },
        },
        components: {
            Container: styled.div``,
            Title: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.discussion-item-icon {
    float: left;
    width: 32px;
    height: 32px;
    margin-top: -5px;
    margin-left: -39px;
    line-height: 28px;
    color: #24292e;
    text-align: center;
    background-color: #e1e4e8;
    border: 2px solid #fff;
    border-radius: 50%;
}


</style>