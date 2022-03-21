import { Link } from "react-router-dom";
// MUI
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { deepPurple, grey } from '@mui/material/colors';
// Styled
import { PinCard } from './index.styles';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  400: 1
};

const Pin = (props) => {
  const { pins, handleDownloadPin, handleSavePin } = props;

  return (
    <>
      {
        pins && pins.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            style={{ padding: "16px" }}
          >
            {
              pins?.map(pin => 
                <PinCard
                  key={pin._id}
                >
                  <Link
                    className="react-link"
                    to={`/pinDetail/${pin._id}`}
                    state={{category: pin.category}}
                  >
                    <div className="pin-cover">
                      <img
                        className="pin-img"
                        src={pin.imgUrl}
                        alt={pin.title}
                      />
                      <div className="pin-hover">
                        <div className="btn-groups">
                          <IconButton
                            className="btn-download"
                            sx={{p: 0}}
                            onClick={(e) => handleDownloadPin(
                              pin.imgUrl,
                              pin.imgUrl.split('/').splice(2).pop().substring(0, pin.imgUrl.length - 4),
                              e
                            )}
                          >
                            <Avatar sx={{ bgcolor: "#ffffff", width: 30, height: 30}}>
                              <DownloadIcon fontSize="small" style={{color: grey[900]}}/>
                            </Avatar>
                          </IconButton>
                          <Button
                            className="btn-save"
                            variant="contained"
                            disableElevation
                            sx={{height: 30}}
                            onClick={(e) => handleSavePin(pin._id, e)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to={`/profile/${pin.creator._id}`} className="react-link">
                    <div className="pin-creator">
                      <Stack direction="row" spacing={2} sx={{m: 1}}>
                        <Avatar
                          src={pin.creator.thumbnail}
                          sx={{ width: 30, height: 30, bgcolor: deepPurple[500] }}
                          alt={pin.creator.username}
                        >
                          {pin.creator.username.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle1" component="div" mt={1}>{pin.creator.username}</Typography>
                      </Stack>
                    </div>
                  </Link>
                </PinCard>
              )
            }
          </Masonry>
        ) : (
          <Typography variant="h5" align="center" gutterBottom component="div">
            No related pins
          </Typography>
        )
      }
    </>
  )
}

export default Pin;