<template>
    <span class="d-inline-block label" :style="{color:fontColor,background:color}">
        {{name}}
    </span>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_color} from '../util'
    export default {
        props: {
            name: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },
        computed: {
            fontColor() {
                let isLight = util_color.isLight(this.color)
                if(isLight) return 'black'
                else return 'white'
            }
        },
        methods: {
            clickHandler() {
                if(this.routerLink) this.$router.push(this.routerLink)
            }
        },
        components: {
            Container: styled.span``
        }
    }
</script>

<style scoped>
.label{
    height: 20px;
    padding: .15em 4px;
    font-size: 12px;
    font-weight: 600;
    line-height: 15px;
    border-radius: 2px;
    box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
}
</style>