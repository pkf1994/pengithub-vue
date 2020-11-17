<template>
    <span class="d-inline-block css-truncate IssueLabel" :style="{color:fontColor,background:`${color}!important`}">
        <span class="css-truncate-target" style="max-width: 100%">{{emojiHandledName}}</span>
    </span>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_color,util_emoji} from '../util'
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
            },
            emojiHandledName(){
                return util_emoji.parse(this.name)
            }
        },
        
        methods: {
            clickHandler() {
                if(this.routerLink) this.$router.push(this.routerLink)
            },
        },
     
        components: {
            Container: styled.span``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';

</style>