<template>
    <Container class="pt-3 px-3 pb-2">
        <Inner class="Box p-3 d-flex">
            <img :src="firstTopic.avatar"
                 width="64"
                 height="64"
                 class="d-block rounded-1 mr-3 flex-shrink-0"
                 alt="vue logo">
            <Main class="d-md-flex flex-items-start flex-auto">
                <MainInner class="flex-auto">
                    <MainTitle class="mb-1">{{firstTopic.display_name}}</MainTitle>
                    <MainDescription>
                        {{firstTopic.short_description}}
                    </MainDescription>
                    <router-link class="text-small" to="/search">See topic</router-link>
                </MainInner>
                <button class="btn  d-flex flex-items-center js-toggler-target" value="Star" title="Star vue">
                    <svg class="d-inline-block v-align-text-top mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>Star
                </button>
            </Main>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from "vuex";
    export default {
        props: {
            firstTopic: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``,
            Main: styled.div``,
            MainInner: styled.div``,
            MainTitle: styled.h3``,
            MainDescription: styled.p``
        }
    }
</script>

<style scoped>

</style>