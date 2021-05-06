<template>
    <span class="d-inline-block css-truncate label" :style="{color:color && fontColor,background:color && `${color}!important`}">
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
                required: false
            }
        },
        
        computed: {
            fontColor() {
                if(!this.color) return 
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
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    border: 1px solid transparent;
    border-radius: 2em;
    padding: 0 10px;
    line-height: 22px;
    color: var(--color-topic-tag-text);
    background-color: var(--color-topic-tag-bg);
}

</style>