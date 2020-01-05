<template>
    <Container class="bg-primary">
        <Inner>
            <Logo>
                <svg height="32" display="block" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </Logo>
            <PanelRight>
                <Button :inline="true"
                        class="border"
                        title="Sign in"
                        @click.native="requestUserIdentity"
                        :style="signUpBtnStyle.buttonContainerStyle"
                        :titleStyle="signUpBtnStyle.titleStyle"/>

                <Menu class="d-flex flex-items-center">

                    <svg height="24" viewBox="0 0 12 16" version="1.1" width="18" aria-hidden="true"><path fill-rule="evenodd" fill="white" d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>
                </Menu>
            </PanelRight>
        </Inner>
    </Container>
</template>

<script>
    import Button from '../Button'
    import {API_OAUTH2} from "../../store/modules/api";
    import styled from 'vue-styled-components'
    export default {
        data(){
          return {
              oauthAuthorizeSite: API_OAUTH2,
              signUpBtnStyle: {
                  buttonContainerStyle: {
                      padding: '4px',
                      paddingRight: '8px',
                      paddingLeft: '8px',
                      background: 'transparent',
                      borderColor: 'white',
                      marginRight: '16px',
                      borderRadius: '6px'
                  },
                  titleStyle: {
                      fontSize: '14px',
                      lineHeight: '21px',
                      color: 'white'
                  }
              }
          }
        },
        methods: {
            requestUserIdentity() {
                window.location.href = API_OAUTH2;
            }
        },
        components: {
            Button,
            Container: styled.div`
                    padding-top: 8px;
                    padding-bottom: 8px;
                    padding-right: 16px;
                    padding-left: 16px;
                `,
                Inner: styled.div`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `,
                Logo:styled.a`
                    align-self: stretch;
                `,
                PanelRight: styled.div`
                    display: flex;
                    align-items: center;
                `,
                Menu:  styled.button`
                    outline: none;
                    background: transparent;
                    border-width: 0;
                    padding-right: 0;
                    padding-left: 0;
                `
        }
    }
</script>

<style scoped>

</style>