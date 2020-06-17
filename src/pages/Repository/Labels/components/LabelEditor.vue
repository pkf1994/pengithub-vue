<template>
    <CreateLabelPane class="p-3 bg-gray border border-gray-dark rounded-1">
        <LabelPreviewRow class="mt-0 mb-2"> 
            <Label :color="color" style="font-size:14px;font-weight:600;padding:4px 8px;line-height:1.25;height:auto" :name="name || 'Label preview'"/>
        </LabelPreviewRow>

        <LabelInfoRow class="mt-0 mb-2">
            <label for="label-name" class="mb-2 d-block">
                Label name
            </label>
            <input @input="$emit('editor-input')" v-model="name" type="text" data-maxlength="50" autocomplete="off" required="" id="label-name" class="form-control width-full" placeholder="Label name">
        </LabelInfoRow>

        <LabelInfoRow class="mt-0 mb-2">
            <label for="label-description" class="mb-2 d-block">
                Description
            </label>
            <input @input="$emit('editor-input')" v-model="description" type="text" data-maxlength="100" autocomplete="off" required="" id="label-description" class="form-control width-full" placeholder="Description(optional)">
        </LabelInfoRow>

        <LabelInfoRow class="mt-0 mb-2">
            <label for="label-color" class="mb-2 d-block">
                Color
            </label>
            <div>
                <button @click="refreshCreateLabelColor" type="button" class="flex-shrink-0 btn-link js-new-label-color rounded-1 mr-1 tooltipped tooltipped-w" style="width: 34px; height: 34px;" :style="{backgroundColor:color}">
                    <svg :style="{color: createLabelPaneColorIsLight ? 'black' : 'white'}" class="octicon octicon-sync" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z"></path></svg>
                </button>
                <input v-model="color" type="text" data-maxlength="7" autocomplete="off" required="" id="label-color" class="form-control" placeholder="Color" style="width:6em">
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
        props: {
            createdHook: {
                type: Function,
                default: () => {}
            },
            defaultName: String,
            defaultColor: String,
            defaultDescription: String,
        },
        data() {
            return {
                color: '',
                name: '',
                description: '',
                loading: false,
            }
        },
        
        computed: {
            createLabelPaneColorIsLight() {
                return util_color.isLight(this.color)
            },
            createdLabelSubmitable() {
                if(!this.color) return
                let colorNumber = parseInt(this.color.replace('#',''),16)
                if(colorNumber > 16777215 || colorNumber < 0) return false
                return this.name
            }
        },
        created() {
            if(!this.defaultColor) this.refreshCreateLabelColor()
            this.createdHook()

            this.defaultName && (this.name = this.defaultName)
            this.defaultColor && (this.color = this.defaultColor)
            this.defaultDescription && (this.description = this.defaultDescription)
        },
        methods: {
            refreshCreateLabelColor() {
                let color = ''
                while(color.length != 6) {
                    color = Math.floor( Math.random() * 0xffffff ).toString(16)
                }
                this.color = '#' + color
            },
        },
        watch: {
            createdLabelSubmitable(newOne,oldOne) {
                if(newOne && !oldOne) {
                    this.$emit('submitable')
                }
                if(!newOne && oldOne) {
                    this.$emit('unsubmitable')
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
</style>