import styled from 'vue-styled-components'

export const Container = styled.div`
    width: 100%;
    height: 40px;
    border-style: solid;
    border-width: 1px;
    border-radius: 100px;
    border-color: #DFE1E5;
    background: white;
    
    display: flex;
    align-items: stretch;
`


export const SubmitBtn = styled.button`
    margin: -1px;
    padding-right: 10px;
    padding-left: 10px;
    border-width: 1px;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const Icon = styled.div`
    height: 24px;
    width: 24px;
    fill: currentColor;
`