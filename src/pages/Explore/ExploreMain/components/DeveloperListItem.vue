<template>
    <Container class="Box-row">
        <Inner class="d-flex inner">
            <AvatarWrapper class="col-3 px-2">
                <img :src="developer.avatar" :alt="`@${developer.username}`" class="d-block width-full">
            </AvatarWrapper>

            <Info class="col-9 mx-2">
                <LoginAndName class="f4 text-bold lh-condensed mb-2">
                    <router-link :to="`/${developer.username}`">{{developer.username}}</router-link>
                    <span class="d-block text-normal text-gray">{{developer.name}}</span>
                </LoginAndName>

                <p class="f6 mb-0">
                    <router-link :to="developer.repo.url.replace('https://github.com','')" class="text-gray ">
                        <svg height="16" class="octicon octicon-repo text-gray v-align-middle mr-1" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                        {{developer.repo.name}}
                    </router-link>
                </p>
            </Info>
        </Inner>   
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            developer: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``,
            AvatarWrapper: styled.div``,
            Info: styled.div``,
            LoginAndName: styled.h3``,
        }
    }
</script>

<style scoped>
.inner {
    margin-right: -8px;
    margin-left: -8px;
}
</style>