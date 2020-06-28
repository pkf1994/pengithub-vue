<template>
    <LabelItem v-if="!showLabelEditor" class="p-3 Box-row position-relative">
        <button v-if="accessToken && viewerIsCollaborator().data" class="btn-link link-gray float-right" @click="triggerPopover">
            <svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
        </button>
        <Popover ref="popover" :popoverStyle="{right: '5px',width: '140px',top: '45px'}" >
            <div class="border-bottom d-flex flex-justify-center flex-items-center px-3 py-2" @click="triggerEdit">
                Edit
            </div>
            <div class="d-flex flex-justify-center flex-items-center px-3 py-2" @click="network_deleteLabel">
                Delete
            </div>
        </Popover>
        <Label :name="label.name" :color="`#${label.color}`"></Label>
        <AnimatedHeightWrapper>
            <Statistic v-if="getOpenIssuesAndPullRequestsCount(label.node_id)" class="description pt-1">{{getOpenIssuesAndPullRequestsCount(label.node_id)}} open issues and pull requests</Statistic>
        </AnimatedHeightWrapper>
        <Description class="description mt-1" style="font-size:14px">
            {{label.description}}
        </Description>

        <transition name="fade" appear>
            <div class="loading-wrapper" v-if="deletingLabel">
                <CommonLoading size="small"></CommonLoading>
            </div>
        </transition>
    </LabelItem>
    <LabelEditor v-else 
                ref="labelEditor"
                style="background-color:white!important" 
                :defaultColor="`#${label.color}`" 
                :defaultName="label.name" 
                :defaultDescription="label.description" 
                @submitable="() => {editedLabelSubmitable = true}" 
                @unsubmitable="() => {editedLabelSubmitable = false}">
        <button :disabled="submittingEditedLabel" class="btn" type="button"  @click="triggerEdit">Cancel</button>
        <button @click="network_updateLabel" class="btn btn-primary" type="submit" :disabled="!editedLabelSubmitable || submittingEditedLabel">
            {{submittingEditedLabel ? 'Saving...' : 'Update label'}}
        </button>

    </LabelEditor>
</template>

<script>
    import {AnimatedHeightWrapper,Label,Popover, CommonLoading} from '@/components'
    import LabelEditor from './LabelEditor'
    import styled from 'vue-styled-components'
    import * as api from '@/network/api'
    import {authRequiredAjax} from '@/network'
    export default {
        name: 'repository_label_item',
        inject: ['viewerIsCollaborator','extraDataProvided'],
        props: {
            label: Object
        },
        data() {
            return {
                showLabelEditor: false,
                submittingEditedLabel: false,
                deletingLabel: false,
                editedLabelSubmitable: false,
            }
        },
        methods: {
            triggerPopover() {
                if(!this.$refs.popover) return 
                this.$refs.popover.show = true
            },
            getOpenIssuesAndPullRequestsCount(id) {
                let dataHolder = this.extraDataProvided().filter(i => i.id == id)[0]
                if(!dataHolder) return
                return dataHolder.issues.totalCount + dataHolder.pullRequests.totalCount
            },
            triggerEdit() {
                this.showLabelEditor = !this.showLabelEditor
            },
            async network_updateLabel() {
                if(!this.acessToken) return 
                if(!this.viewerIsCollaborator().data) return 
                try{
                    this.submittingEditedLabel = true
                    let url = api.API_HANDLE_LABEL({
                        ...this.$route.params,
                        label: this.label.name
                    })

                    let res = await authRequiredAjax(
                        url,
                        {
                            new_name: this.$refs.labelEditor.name,
                            color: this.$refs.labelEditor.color.replace('#',''),
                            description: this.$refs.labelEditor.description,
                        },
                        'patch'
                    )

                    this.$emit('label-updated',{
                        ...res.data,
                        prev: this.label
                    })

                    this.showLabelEditor = false

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.submittingEditedLabel = false
                }
            },
            async network_deleteLabel() {
                this.$refs.popover.show = false
                if(!this.acessToken) return 
                if(!this.viewerIsCollaborator().data) return 
                try{
                    this.deletingLabel = true
                    let url = api.API_HANDLE_LABEL({
                        ...this.$route.params,
                        label: this.label.name
                    })

                    let res = await authRequiredAjax(url, {}, 'delete')

                    this.$emit('label-deleted',this.label)

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.deletingLabel = false
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            Label,
            Popover,
            LabelEditor,
            CommonLoading,
            LabelItem: styled.div``,
            Description: styled.div``,
            Statistic: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.description{
    margin: 0;
    font-size: 12px;
    color: #586069;
}
.loading-wrapper{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    transform: translate(0)
}
</style>