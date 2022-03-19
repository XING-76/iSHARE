import styled from 'styled-components';

export const PinCard = styled.div`
  .pin-cover{
    position: relative;
    .pin-img {
      border-radius: 8px;
      width: 100%;
      display: block;
    }

    .pin-hover {
      display: flex;
      opacity: 0;
      border-radius: 8px;
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 50;
      background-color: #3C3C3C;
      transition: cubic-bezier(.4,0,.2,1) .5s;
      &:hover{
        opacity: .7;
      }

      .btn-groups {
        padding: 1rem .6rem;
        display: flex;
        height: fit-content;
        width: 100%;
        justify-content: space-between;
        .btn-download {
          opacity: .8;
          &:hover {
            opacity: 1;
          }
        }
        .btn-save {
          height: auto;
          text-transform: none;
          border-radius: 1.5rem;
          opacity: .8;
          background-color: #ff1744;
          color: #fff;
          &:hover {
            opacity: 1;
          }
        }
        .btn-delete {
          text-transform: none;
          border-radius: 1.5rem;
          opacity: .8;
          background-color: #ff1744;
          color: #fff;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  .pin-creator {
    transition: .8s;
    &:hover {
      opacity: .8;
    }
  }
`;