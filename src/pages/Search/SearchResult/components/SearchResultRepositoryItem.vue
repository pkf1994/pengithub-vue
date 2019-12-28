<template>
    <Container class="py-4 border-bottom flex flex-justify-start">
        <IconColumn class="flex-shrink-0 mr-2">
            <svg height="16"
                 style="color: #6a737d"
                 class="d-inline-block v-align-text-bottom"
                 viewBox="0 0 12 16"
                 version="1.1"
                 width="12"
                 aria-hidden="true">
                <path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
        </IconColumn>

        <Main class="mt-n1">
            <FullName class="f4 text-normal">
                <router-link :to=`/${repository.full_name}`>{{repository.full_name}}</router-link>
            </FullName>
            <Description class="mb-1">
                {{repository.description}}
            </Description>
        </Main>
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
            IconColumn: styled.div``,
            Main: styled.div``,
            FullName: styled.div``,
            Description: styled.p``
        }
    }
</script>

<style scoped>

</style>