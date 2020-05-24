<template>
    <Container>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,Editor} from '@/components'
    export default {
        name: 'repository_issue_new_page',
        data() {
            return {
                loading: false
            }
        },
        components: {
            CommonLoadingWrapper,
            Editor,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>