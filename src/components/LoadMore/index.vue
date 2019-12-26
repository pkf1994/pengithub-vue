<template>
    <Container>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            loading: {
                type: Boolean,
                required: true
            },
            dataGetter: {
                type: Function,
                required: true
            }
        },
        components: {
            Container:styled.div``
        }
    }
</script>

<style scoped>

</style>