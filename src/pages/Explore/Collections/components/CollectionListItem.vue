<template>
    <Container class="d-flex border-bottom border-gray-light pb-4 mb-5">
        <AvatarColumn class="col-2 mr-3">
            <DefaultAvatar v-if="!collection.avatar" class="bg-blue-light f4 text-gray-light text-bold rounded-1 flex-shrink-0 text-center" style="height:64px; line-height:64px;">#</DefaultAvatar>
            <img v-else class="width-full" :src="collection.avatar" :alt="`@${collection.displayName}`">
        </AvatarColumn>
        <Main class="col-10">
            <h2 class="h3">
                <router-link :to="`/explore/collections/${collection.name}`">
                    {{collection.displayName}}
                </router-link>
            </h2>
            {{collection.description}}
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            collection: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
            AvatarColumn: styled.div``,
            DefaultAvatar: styled.div``,
            Main: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
</style>