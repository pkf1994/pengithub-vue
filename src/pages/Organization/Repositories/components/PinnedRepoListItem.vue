<template>
    <Container class="Box d-flex p-3 d-flex flex-column">
        <Name class="d-flex width-full flex-items-center position-relative">
            <svg class="octicon octicon-repo mr-2 text-gray flex-shrink-0" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            <router-link class="text-bold flex-auto min-width-0" :to="`/${repository.owner.login}/${repository.name}`">{{repository.name}}</router-link>
        </Name>
        <Description class="description text-gray text-small d-block mt-2 mb-3" >
            {{repository.description}}
        </Description>

        <TheMeta class="mb-0 f6 text-gray">
            <PrimaryLanguage v-if="repository.primaryLanguage && repository.primaryLanguage.name" class="d-inline-block mr-3">
                <LanguageBadge v-if="repository.primaryLanguage.color" class="repo-language-color" :style="{backgroundColor:repository.primaryLanguage.color}">
                </LanguageBadge>
                <span>
                    {{repository.primaryLanguage.name}}
                </span>
            </PrimaryLanguage>
            
            <router-link to="/" class="d-inline-block muted-link">
                <svg aria-label="stars" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{repository.stargazers.totalCount | thousands2K2M(1)}}
            </router-link>

            <router-link to="/" class="ml-3 d-inline-block muted-link">
                <svg aria-label="forks" class="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10" height="16" role="img"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{repository.forkCount | thousands2K2M(1)}}
            </router-link>
        </TheMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
            Name: styled.div``,
            Description: styled.p``,
            TheMeta: styled.p``,
            PrimaryLanguage: styled.span``,
            LanguageBadge: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.description{
    flex: 1 0 auto;
}
.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>