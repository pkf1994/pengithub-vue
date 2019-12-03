import styled from 'vue-styled-components'

const containerProps = {
    inline: Boolean
}

export const Container = styled('button',containerProps)`
    display: flex;
    justify-content: center;
    align-items: center;
    
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    border-radius: 5px;
    
    width: ${props => props.inline ? 'auto' : '100%'};
    height: ${props => props.inline ? 'auto' : '36px'};
    
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    
    font: inherit;
`

export const Title = styled('div',{
    inline: Boolean
})`
    font-size: ${props => props.inline ? 'inherit':'20px'};
`