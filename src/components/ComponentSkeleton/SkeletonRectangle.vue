<template>
    <Rectangle class="rectangle" :style="{height: `${height}px`,width: `${width}px`,background: color}">
    </Rectangle>
</template>
<script>
import styled from 'vue-styled-components'
export default {
    props: {
        height: Number,
        width: Number,
        color: String
    },
    components: {
        Rectangle: styled.div``
    }
}
</script>
<style scoped>
.rectangle{
    background: #f6f8fa;
}
</style>