<template>
    <Container class="mb-2 ws-normal bg-white box-shadow rounded-2 border pl-5 p-2 position-relative">
        <svg class="octicon octicon-note text-gray-light position-absolute" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3 10h4V9H3v1zm0-2h6V7H3v1zm0-2h8V5H3v1zm10 6H1V3h12v9zM1 2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1H1z"></path></svg>
        <Action class="mr-3 mt-2 right-0 top-0 position-absolute text-gray-light btn-octicon">
            <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
        </Action>

        <Main class="mr-4">
            <Note v-html="noteHTML">
            </Note>

            <small class="text-gray-light">
                Added by
                <router-link class="text-gray-dark" :to="`/${card.creator.login}`">{{card.creator.login}}</router-link>
            </small>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    export default {
        props: {
            card: {
                type: Object,
                required: true
            }
        },
        computed: {
            noteHTML() {
                return util_markdownParse.markdownToHTML(this.card.note)
            }
        },
        components: {
            Container: styled.div``,
            Action: styled.div``,
            Main: styled.div``,
            Note: styled.p``,
        }
    }
</script>

<style scoped>
.octicon-note{
    top: 12px;
    left: 10px;
}
</style>