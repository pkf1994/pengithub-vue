<template>
    <BaseHeader>
        <router-link to="/" class="mr-3" style="color: hsla(0,0%,100%,.7);" >
            <div class="d-flex flex-items-center">
                 <svg class="octicon octicon-project mr-1" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
                <AnimatedWidthWrapper>
                    <strong class="text-white d-inline-block no-wrap"><slot></slot></strong>
                </AnimatedWidthWrapper>
            </div>
        </router-link>
    </BaseHeader>
</template>

<script>
    import {BaseHeader,AnimatedWidthWrapper} from "@/components";
    export default {
        components: {
            BaseHeader,
            AnimatedWidthWrapper
        }
    }
</script>

<style scoped>

</style>