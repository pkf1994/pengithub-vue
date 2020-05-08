<template>
    <Container class="container">
        <transition-group name="toast-slide" appear>
            <ToastContent v-for="item in toastArr" :key="item.uniMeta" class="toast-content" :class="{warn: item.type === 'warn',error: item.type === 'error'}">
                {{item.content}}
            </ToastContent>
        </transition-group>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Vue from 'vue'
    export default {
        data() {
            return {
                duration: 2000,
                prevToast: {
                    content: '',
                    type: undefined,
                    duration: undefined
                },
                toastArr: [
                  
                ]
            }
        },
        methods: {
            pushToast(content,type = 'notice',duration = 3000) {
                if(!content) return 
                if(!content.message) return 
                if(content.message.trim() == '') return 
                
                if(content.toString() == this.prevToast.content.toString() && type == this.prevToast.type) {
                    Vue.set(this.toastArr,this.toastArr.length - 1,{
                        ...this.toastArr[this.toastArr.length - 1],
                        duration: parseInt(duration) + parseInt(this.prevToast.duration)
                    })
                } else {
                    if(this.toastArr.length == 3) this.shiftToast()
                    this.toastArr.push({
                        content,
                        type,
                        duration,
                        uniMeta: (new Date()).getTime() + parseInt(Math.random() * 100) 
                    })
                }

                this.prevToast = {
                    content,
                    type,
                    duration
                }
            },
            shiftToast() {
                this.toastArr.shift()
            }
        },
        watch: {
            toastArr(newOne,oldOne) {
                if(newOne.length > 0) {
                    clearTimeout(this.shiftTimer)
                    this.shiftTimer = setTimeout(() => {
                        this.shiftToast()
                    },newOne[newOne.length - 1].duration)
                }
            }
        },
        components: {
            Container: styled.div``,
            ToastContent: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.container{
    position: fixed;
    bottom: 24px;
    left: 24px;
    right: 24px;
    z-index: 9;
    justify-content: center;
    align-content: center;
}

.toast-content{
    line-height: 1.25;
    text-align: center;
    padding: 16px 24px;
    border-radius: 12px;
    background-color: #fafbfc;
    box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
    font-size: 20px;
    margin-bottom: 8px;
    transition: all .4s ease;
}
.warn{
    background: #FFF8DD;
    color: #EE8F00
}
.error{
    background: #FFEEEE;
    color: #FF0000;
}



.toast-slide-enter {
  opacity: 0;
  transform: translateY(30px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

</style>