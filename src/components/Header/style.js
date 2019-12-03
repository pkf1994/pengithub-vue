import styled from 'vue-styled-components'

export const HEIGHT_HEADER = '48px'

export const Container = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    height: ${HEIGHT_HEADER};
    border-bottom: solid 1px #F0F0F0;
`

export const Logo = styled.div`
    height: 100%;
    width: ${HEIGHT_HEADER};
    padding: 10px;
    background: transparent;
    box-sizing: border-box;
    border-width: 0;
    outline:none;
    display:flex;
    justify-content: center;
    align-items: stretch
`

export const LogoInner = styled.div`
    flex:1;
    height: 100%;
`

export const Title = styled.div`
    font-size: 20px;
    color: gray;
`

export const BtnGroupRight = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
`

export const Search = styled.button`
    width: ${HEIGHT_HEADER};
    color: gray;
    border-width: 0;
    background: transparent;
    outline:none;
    
    display: flex;
    align-items: center;
    justify-content: center;
`

export const User = styled(Search)`

`

export const SearchHeader = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    
    display:flex;
    align-items: stretch
`

export const InputWrapper = styled.div`
    flex:1;
    display:flex;
`

export const Cancel = styled.button`
    color: gray;
    outline: none;
    border-width: 0;
    background: transparent;
    width: ${HEIGHT_HEADER};
`

export const Cover = styled.div`
    position: fixed;
    top: ${HEIGHT_HEADER};
    bottom: 0;
    right: 0;
    left: 0;
    background: black;
    opacity: .1;
`
