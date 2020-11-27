<template>
    <LabelItem v-if="!showLabelEditor" class="p-3 Box-row position-relative" :class="{'loading-delete':loadingDeleteLabel}">
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

    </LabelItem>
    <LabelEditor v-else 
                ref="labelEditor"
                style="background-color:white!important" 
                class="bg-gray"
                :labelNameError="labelNameError"
                v-model="editLabelData"
                >
        <button :disabled="loadingEditLabel" class="btn" type="button"  @click="triggerEdit">Cancel</button>
        <button @click="network_updateLabel" class="btn btn-primary" type="submit" :disabled="!editedLabelSubmitable || loadingEditLabel || labelNameError">
            {{loadingEditLabel ? 'Saving...' : 'Update label'}}
        </button>

    </LabelEditor>
</template>

<script>
    import {AnimatedHeightWrapper,Label,Popover, CommonLoading} from '@/components'
    import LabelEditor from './LabelEditor'
    import styled from 'vue-styled-components'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredPatch,authRequiredDelete,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import {util_throttle} from '@/util'
    export default {
        name: 'repository_label_item',
        inject: ['viewerIsCollaborator','extraDataProvided','viewerCanManageIssue'],
        props: {
            label: Object
        },
        data() {
            return {
                editLabelData: {},
                showLabelEditor: false,
                loadingEditLabel: false,
                loadingDeleteLabel: false,
                labelNameError: false,
            }
        },
        computed: {
            editedLabelSubmitable() {
                if(!this.editLabelData.name) return
                if(!this.editLabelData.color) return
                let colorNumber = parseInt(this.editLabelData.color.replace('#',''),16)
                if(colorNumber > 16777215 || colorNumber < 0) return
                return true
            },
        },
        created() {
            this.editLabelData = {
                ...this.label,
                color: `#${this.label.color}`
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
                if(!this.accessToken) return 
                //if(!this.viewerIsCollaborator().data) return 
                try{
                    this.loadingEditLabel = true
                    let url = api.API_HANDLE_LABEL({
                        ...this.$route.params,
                        label: this.label.name
                    })

                    let res = await authRequiredPatch(
                        url,
                        {
                            new_name: this.editLabelData.name,
                            color: this.editLabelData.color.replace('#',''),
                            description: this.editLabelData.description,
                        },
                    )


                    this.$el.dispatchEvent(new CustomEvent('label-updated',{bubbles:true,detail:{...res.data,prev:this.label}}))

                    this.showLabelEditor = false

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loadingEditLabel = false
                }
            },
            async network_deleteLabel() {
                this.$refs.popover.show = false
                if(!this.accessToken) return 
                if(!this.viewerCanManageIssue()) return 
                try{
                    this.loadingDeleteLabel = true
                    let url = api.API_HANDLE_LABEL({
                        ...this.$route.params,
                        label: this.label.name
                    })

                    let res = await authRequiredDelete(url)

                    this.$el.dispatchEvent(new CustomEvent('label-deleted',{bubbles:true,detail:this.label}))

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loadingDeleteLabel = false
                }
            },
            async network_checkIfLabelNameHasBeenTaken() {
                try {
                    let u = api.API_HANDLE_LABEL({
                        repo: this.repo,
                        owner: this.owner,
                        label: this.editLabelData.name
                    })

                    await authRequiredGet(
                        u,
                        {
                            cancelToken: cancelAndUpdateAxiosCancelTokenSource(this.label.name + ' check_if_label_name_has_been_taken').cancelToken
                        }
                    )

                    if(this.editLabelData.name != this.label.name) {
                        this.labelNameError = true
                    }else{
                        this.labelNameError = false
                    }

                } catch (e) {
                    console.log(e) 
                    this.labelNameError = false
                } 
            },
        },
         watch:{
            'editLabelData.name': function(newOne,oldOne) {
                this.labelNameError = false
                util_throttle.throttleByDelay(this.network_checkIfLabelNameHasBeenTaken,500,this)
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
.loading-delete{
    opacity: .4;
}
</style>