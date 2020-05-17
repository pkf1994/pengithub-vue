<template>
    <Container>
        <div v-if="!notFoundFlag" class="d-flex flex-column flex-grow-1">
            <slot></slot>
        </div>
        <NotFoundPage v-else></NotFoundPage>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.vue'
    export default {
        data() {
            return {
                notFoundFlag: false
            }
        },
        computed: {
            routerFullPath() {
                return this.$route.fullPath
            }
        },
        watch: {
            routerFullPath() {
                this.notFoundFlag = false
            }
        },
        components: {
            NotFoundPage,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>