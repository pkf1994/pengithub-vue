<template>
    <Container class="Box-row">
        <Star class="float-right link-gray no-wrap mb-2 ml-2">
            <svg height="16" class="octicon octicon-star mt-1 mr-1" mt="1" mr="1" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
            {{formatStarNumber}}
        </Star>

        <FullName class="d-flex">
            <span>
                <svg height="16" class="octicon octicon-repo mr-2 text-gray" color="gray" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            </span>
            <h1 class="f4 text-gray text-normal lh-condensed">
                <router-link :to="`/${repository.author}`">{{repository.author}}</router-link> /
                <router-link :to="`/${repository.author}/${repository.name}`" class="text-bold">{{repository.name}}</router-link>
            </h1>
        </FullName>

        <p class="f6 text-gray mt-2 mb-0">
            {{repository.description}}
        </p>    
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
                return util_numberFormat.thousands2K2M(this.repository.stars,1)
            }
        },
        components: {
            Container: styled.div``,
            Star: styled.span``,
            FullName: styled.div``,
        }
    }
</script>

<style scoped>

</style>