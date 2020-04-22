<template>
    <Container class="Box-row">
        <Inner class="d-flex inner">
            <AvatarWrapper class="col-3 px-2">
                <ImgWrapper>
                    <img :src="developer.avatar" :alt="`@${developer.username}`" class="d-block width-full">
                </ImgWrapper>
            </AvatarWrapper>

            <Info class="col-9 mx-2">
                <LoginAndName class="h3 text-bold lh-condensed mb-2">
                    <router-link :to="`/${developer.username}`">{{developer.name}}</router-link>
                    <span class="d-block text-normal text-gray">{{developer.username}}</span>
                </LoginAndName>

                <div class="f6 text-gray text-uppercase mb-1"><svg class="octicon octicon-flame text-orange-light mr-1" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"></path></svg>
                    Popular repo
                </div>

                <h1 class="h4 lh-condensed">
                    <router-link :to="developer.repo.url.replace('https://github.com','')">
                        <svg height="16" class="octicon octicon-repo text-gray v-align-middle mr-1" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
                        {{developer.repo.name}}
                    </router-link>
                </h1>

                <RepoDescription class="f6 text-gray mt-1">
                    {{developer.repo.description}}
                </RepoDescription>

                <Action class="mt-3">
                    <button class="btn btn-sm" :disabled="viewerIsFollowing === undefined">
                        {{viewerIsFollowing ? 'Unfollow' : 'Follow'}}
                    </button>
                </Action>
            </Info>
        </Inner>   
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper} from '@/components'
    export default { 
        inject: ['viewerIsFollowingProvided'],
        props: {
            developer: {
                type: Object,
                required: true
            }
        },
        computed: {
            viewerIsFollowing() {
                let viewerIsFollowingHolder = this.viewerIsFollowingProvided().filter(i => i.login == this.developer.username)[0]
                return viewerIsFollowingHolder ? viewerIsFollowingHolder.viewerIsFollowing : undefined
            }
        },
        components: {
            ImgWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            AvatarWrapper: styled.div``,
            Info: styled.div``,
            LoginAndName: styled.h1``,
            RepoDescription: styled.div``,
            Action: styled.div``,
        }
    }
</script>

<style scoped>
.inner {
    margin-right: -8px;
    margin-left: -8px;
}
</style>