<template>
    <CreateLabelPane class="p-3">
        <LabelPreviewRow class="mt-0 mb-3"> 
            <Label v-if="label.color" :color="labelNameError ? '#B60205' : label.color" style="padding:4px 8px;line-height:1.25;height:auto" :style="previewLabelStyle" :name="label.name || 'Label preview'"/>
        </LabelPreviewRow>

        <LabelInfoRow class="mt-0 mb-3 position-relative">
            <label for="label-name" class="mb-2 d-block" :class="{errored:labelNameError}">
                Label name
            </label>
            <input ref="labelName"
                    :class="{errored:labelNameError}"
                    @input="$emit('input',{...getEdittingLabel(),name:$event.target.value})" 
                    :value="label.name" type="text" data-maxlength="50" autocomplete="off" required="" id="label-name" class="form-control width-full" placeholder="Label name">
            <div v-if="labelNameError" class="error-notice" id="label--name-error">Name has already been taken</div>
        </LabelInfoRow>

        <LabelInfoRow class="mt-0 mb-3">
            <label for="label-description" class="mb-2 d-block">
                Description
            </label>
            <input ref="labelDescription" 
                    @input="$emit('input',{...getEdittingLabel(),description:$event.target.value})"
                    :value="label.description" type="text" data-maxlength="100" autocomplete="off" required="" id="label-description" class="form-control width-full" placeholder="Description(optional)">
        </LabelInfoRow>

        <LabelInfoRow class="mt-0 mb-3">
            <label for="label-color" class="mb-2 d-block">
                Color
            </label>
            <div>
                <button @click="refreshCreateLabelColor" type="button" class="flex-shrink-0 btn-link js-new-label-color rounded-1 mr-1 tooltipped tooltipped-w" style="width: 30px; height: 30px;" :style="{backgroundColor:label.color}">
                    <svg :style="{color: createLabelPaneColorIsLight ? 'black' : 'white'}" class="octicon octicon-sync" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z"></path></svg>
                </button>
                <input ref="labelColor" 
                        @input="$emit('input',{...getEdittingLabel(),color:$event.target.value})" 
                        :value="label.color" type="text" data-maxlength="7" autocomplete="off" required="" id="label-color" class="form-control" placeholder="Color" style="width:6em">
            </div>
        </LabelInfoRow>

        <div class="mt-3 actions">
            <slot></slot>    
        </div>
    </CreateLabelPane>
</template>

<script>
    import {Label} from '@/components'
    import styled from 'vue-styled-components'
    import {util_color} from '@/util'
    export default {
        name: 'repository_label_editor',
        model: {
            prop: 'label',
            event: 'input'
        },
        props: {
            previewLabelStyle: Object,
            label: Object,
            labelNameError: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            createLabelPaneColorIsLight() {
                if(!this.label.color) return
                return util_color.isLight(this.label.color)
            },
        },
        created() {
            if(!this.label.color) this.refreshCreateLabelColor()
        },
        methods: {
            refreshCreateLabelColor() {
                let color = ''
                while(color.length != 6) {
                    color = Math.floor( Math.random() * 0xffffff ).toString(16)
                }
                this.$emit('input',{color:'#' + color,name:this.label.name})
            },
            getEdittingLabel() {
                return {
                    name: this.$refs.labelName.value,
                    color: this.$refs.labelColor.value,
                    description: this.$refs.labelDescription.value,
                }
            }
        },
        components: {
            Label,
            CreateLabelPane: styled.div``,
            LabelPreviewRow: styled.div``,
            LabelInfoRow: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';

label.errored{
    color: #cb2431;
}

input.errored{
    border-color: #cb2431!important;
}

.error-notice{
    color: #86181d;
    background-color: #ffeef0;
    border-color: #f97583;
    position: absolute;
    z-index: 10;
    display: block;
    max-width: 450px;
    padding: 4px 8px;
    margin: 10px 0 0;
    font-size: 12px;
    font-weight: 400;
    border-style: solid;
    border-width: 1px;
    border-radius: 6px;
}
.error-notice::before{
    position: absolute;
    bottom: 100%;
    left: 10px;
    z-index: 15;
    width: 0;
    height: 0;
    pointer-events: none;
    content: " ";
    border: solid transparent;
    margin-left: -1px;
    border-width: 6px;
    border-bottom-color: rgb(249, 117, 131);
}
.error-notice::after{
    position: absolute;
    bottom: 100%;
    left: 10px;
    z-index: 15;
    width: 0;
    height: 0;
    pointer-events: none;
    content: " ";
    border: solid transparent;
    border-width: 5px;
    border-bottom-color: rgb(255, 238, 240);
}
</style>