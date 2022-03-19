import styled from 'styled-components';

export const Pinbox = styled.div`
  padding: 1rem;
  border-radius: .5rem;

  .upload-input {
    cursor: pointer;
    height: 100%;
    opacity: 0;
    position: absolute;
    width: 100%;
    left: 0px;
    top: 0px;
    font-size: 0px;
  }

  .upload-img {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
  }
`;

export const PinForm = styled.div`
  padding: 1rem;
  border-radius: .5rem;

  #create-pin-category {
    display: flex;
  }
  
  .save-btn {
    display: flex;
    justify-content: flex-end;
  }
`;