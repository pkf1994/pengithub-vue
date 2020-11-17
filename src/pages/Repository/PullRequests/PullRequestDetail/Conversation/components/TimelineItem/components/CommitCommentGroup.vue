<template>
    <Container>
        
    </Container>
</template>

<script>
import styled from 'vue-styled-components'
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            commitCommentsExtraData: {
                data: [],
                loading: false
            }
        }
    },
    components: {
        Container: styled.div``
    }
}
</script>

<style scoped>
</style>