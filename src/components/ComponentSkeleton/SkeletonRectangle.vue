<template>
    <Rectangle class="rectangle" :style="{height: `${height}px`,width:computedWidth,background: color}">
    </Rectangle>
</template>
<script>
import styled from 'vue-styled-components'
export default {
    props: {
        height: Number,
        width: Number,
        minWidth: Number,
        maxWidth: Number,
        minWidthPercent: Number,
        maxWidthPercent: Number,
        color: String
    },
    data() {
        return {
            randomWidth: undefined,
            randomWidthPercent: undefined
        }
    },
    computed: {
        computedWidth() {
            if(this.width) return `${this.width}px`
            if(this.randomWidth) return `${this.randomWidth}px`
            if(this.randomWidthPercent) return `${this.randomWidthPercent}%`
        }
    },
    created() {
        if(this.maxWidth && this.minWidth && this.maxWidth > this.minWidth) {
            let width = Math.random() * (this.maxWidth - this.minWidth)
            this.randomWidth = parseInt(width + this.minWidth)
        }
        if(this.maxWidthPercent && this.minWidthPercent && this.maxWidthPercent > this.minWidthPercent) {
            let widthPercent = Math.random() * (this.maxWidthPercent - this.minWidthPercent)
            this.randomWidthPercent = parseInt(widthPercent + this.minWidthPercent)
        }
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