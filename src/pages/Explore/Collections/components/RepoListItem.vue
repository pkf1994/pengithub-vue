<template>
    <Container class="Box-row">
        <StarBtn class="float-right">
            <button class="btn btn-sm">
                <svg height="16" class="octicon octicon-star v-align-text-bottom" vertical_align="text_bottom" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
               {{repository.viewerHasStarred ? 'Unstar' : 'Star'}}
            </button>
        </StarBtn>

        <h1 class="h3 text-gray text-normal lh-condensed">
            <span>
                <svg height="20" class="octicon octicon-repo mr-1 text-gray" color="gray" viewBox="0 0 12 16" version="1.1" width="20" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            </span>
            <router-link :to="`/${repository.owner.login}`">{{repository.owner.login}}</router-link> /
            <router-link :to="`/${repository.owner.login}/${repository.name}`" class="text-bold">{{repository.name}}</router-link>
        </h1>

        <p class="text-gray my-1 f4">
            {{repository.description}}
        </p>    

        <Meta class="f6 text-gray mt-2">

            <span class="muted-link d-inline-block mr-3">
                <svg height="16" class="octicon octicon-star" aria-label="star" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{formatStarNumber}}
            </span>

            <span class="muted-link d-inline-block mr-3">
                <svg class="octicon octicon-git-branch mr-1" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{formatForksNumber}}
            </span>

             <span class="d-inline-block ml-0 mr-3"  v-if="repository.languages.nodes[0]">
                <span class="repo-language-color" :style="{'backgroundColor': repository.languages.nodes[0].color}"></span>
                <span>{{repository.languages.nodes[0].name}}</span>
            </span>

        </Meta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_numberFormat} from '@/util'
    export default {
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            formatStarNumber() {
                return util_numberFormat.thousands(this.repository.stargazers.totalCount)
            },
            formatForksNumber() {
                return util_numberFormat.thousands(this.repository.forkCount)
            },
        },
        components: {
            Container: styled.div``,
            StarBtn: styled.span``,
            FullName: styled.div``,
            Meta: styled.div``
        }
    }
</script>

<style scoped>
.repo-language-color{
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>