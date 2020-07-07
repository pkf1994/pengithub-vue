<template>
    <TheCircle class="circle d-inline-block" :style="{height: `${diameter}px`,width: `${diameter}px`,background: color}">
    </TheCircle>
</template>
<script>
import styled from 'vue-styled-components'
export default {
    props: {
        diameter: Number,
        color: String
    },
    components: {
        TheCircle: styled.div``
    }
}
</script>
<style scoped>
.circle{
    border-radius: 50%;
    background: #f6f8fa;
}
</style>