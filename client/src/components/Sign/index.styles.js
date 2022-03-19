import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: flex-start;

  .sign-field {
    position: relative;
    width: 100%;
    height: 100%;

    video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }

    .sign-form {
      position: absolute;
      background-color: rgba(0,0,0,.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
`;