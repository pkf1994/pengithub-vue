<template>
    <span class="d-inline-block label css-truncate" :style="{color:fontColor,background:`${color}!important`}">
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
.label{
    padding-right: 7px!important;
    padding-left: 7px!important;
    padding-top: 0px!important;
    padding-bottom: 0px!important;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px!important;
    border-radius: 2em!important;
    box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
}
</style>