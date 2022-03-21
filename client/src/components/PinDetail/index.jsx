import { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { deepPurple, grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
// Styled
import { PinImg, PinText } from './index.styles';
import { PinCard } from '../Pin/index.styles';
import Masonry from 'react-masonry-css';
// Service
import PinService from '../../services/pin.service';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    {...props}
  />
))(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    flexGrow: "0"
  },
}));

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#efefef',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#efefef',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#efefef',
      borderRadius: '1.5rem',
    },
    '&:hover fieldset': {
      borderColor: '#efefef',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#efefef',
    },
  },
});

const PinDetail = (props) => {
  const { currentUser, fisherYatesShuffle, handleDownloadPin, handleSavePin } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { category } = location.state || {};
  const { pinID } = params;

  const [pinDetail, setPinDetail] = useState({});
  const [otherPins, setOtherPins] = useState([]);
  const [postComment, setPostComment] = useState("");

  useEffect(() => {
    getPinDetail();
    getOtherPins();
  }, [pinID])
  
  const getPinDetail = () => {
    PinService.getPin(pinID)
      .then((res) => setPinDetail(res.data))
      .catch(() => navigate('/notfound'))
  }

  const getOtherPins = () => {
    PinService.getPins()
      .then(res => {
        const filterPins = res.data.filter(pin => pin._id !== pinID);
        const filterCategoryPins = filterPins.filter(pin => pin.category === category);
        setOtherPins(fisherYatesShuffle(filterCategoryPins));
      })
      .catch(e => console.log(e))
  }

  const handleDestinationLink = (destinationLink) => {
    window.open(destinationLink);
  }

  const handleSubmitPostComment = (key) => {
    if(key === "Enter") {
      handlePostComment();
    }
    return
  }

  const handlePostComment = () => {
    const postObj = {
      pin_id: pinDetail._id,
      comment: postComment
    }
    PinService.postComment(postObj)
      .then(() => {
        setPostComment("");
        getPinDetail();
      })
      .catch(e => console.log(e))
  }

  const goToProfile = (creatorID) => navigate(`/profile/${creatorID}`);

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "90%",
        margin: "auto",
        marginTop: "1rem"
      }}
    >
      { pinDetail && pinDetail.creator && (
        <Grid container mb={4} sx={{backgroundColor: "#fff", borderRadius: "1.5rem"}}>
          <Grid item xs={12} sm={12} md={6}>
            <PinImg>
              <img
                className="pin-img"
                src={pinDetail.imgUrl}
                alt={pinDetail.title}
              />
            </PinImg>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <PinText>
              <Stack direction="row" spacing={2} justifyContent="space-between" sx={{p: "0 16px"}}>
                <div className="pin-btn">
                  <IconButton
                    aria-label="download"
                    onClick={(e) => handleDownloadPin(
                      pinDetail.imgUrl,
                      pinDetail.imgUrl.split('/').splice(2).pop().substring(0, pinDetail.imgUrl.length - 4),
                      e
                    )}
                  >
                    <DownloadIcon fontSize="inherit" />
                  </IconButton>
                </div>
                <div className="pin-btn">
                  <Button
                    className="btn-save"
                    variant="contained"
                    disableElevation
                    sx={{height: 30}}
                    onClick={(e) => handleSavePin(pinDetail._id, e)}
                  >
                    Save
                  </Button>
                </div>
              </Stack>
              <Stack justifyContent="space-between" mb={2} sx={{p: "0 16px"}}>
                <Link
                  to="#"
                  className="react-link"
                  style={{marginTop: ".3rem"}}
                  onClick={() => handleDestinationLink(pinDetail.destinationLink)}
                >
                  {pinDetail.destinationLink.split('/').splice(2)[0]}
                </Link>
              </Stack>
              <Stack spacing={2} mb={2} sx={{p: 1}}>
                <Typography variant="h4" component="div" sx={{ paddingLeft: "8px" }}>
                  {pinDetail.title}
                </Typography>
                <Typography variant="body1" component="div">
                  <Button
                    sx={{p: 0}}
                    onClick={() => goToProfile(pinDetail.creator._id)}
                  >
                    <Avatar
                      src={pinDetail.creator.thumbnail}
                      sx={{ textTransform: "none", bgcolor: deepPurple[500] }}
                      alt={pinDetail.creator.username}
                    >
                      {pinDetail.creator.username.charAt(0)}
                    </Avatar>
                  </Button>
                  <Typography
                    variant="button"
                    onClick={() => goToProfile(pinDetail.creator._id)}
                    mt={.6}
                    sx={{ cursor: "pointer"}}
                  >
                    {pinDetail.creator.username}
                  </Typography>
                </Typography>
                <Typography variant="h6" sx={{ paddingLeft: "8px", whiteSpace: "pre-wrap" }}>
                  {pinDetail.description}
                </Typography>
                <Accordion sx={{boxShadow: "none", ":before": {"display": "none"}}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{padding: "0", justifyContent: "flex-start", paddingLeft: "8px"}}
                  >
                    <Typography>Comments</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{padding: "0", overflowY: "scroll", maxHeight: "200px"}}>
                  {
                    pinDetail.comments?.map(commentor => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={2}
                        key={commentor.date}
                      >
                        <Button
                          sx={{p: 0}}
                          onClick={() => goToProfile(commentor._id)}
                        >
                          <Avatar
                            sx={{ bgcolor: deepPurple[500], textTransform: "none" }}
                            src={commentor.thumbnail}
                            alt={commentor.username}
                            >
                            {commentor.username.charAt(0)}
                          </Avatar>
                        </Button>
                        <Stack>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            component="div"
                            sx={{fontWeight: "600"}}
                          >
                            {commentor.username}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            component="div"
                          >
                            {commentor.comment}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))
                  }
                  </AccordionDetails>
                  {
                    currentUser && (
                      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                        <Button disabled sx={{p: 0}}>
                          <Avatar
                            src={currentUser.user.thumbnail}
                            sx={{ bgcolor: deepPurple[500], textTransform: "none" }}
                            alt={currentUser.user.username}
                          >
                            {currentUser.user.username.charAt(0)}
                          </Avatar>
                        </Button>
                        <CssTextField
                          id="outlined-basic"
                          placeholder="Add a comment"
                          size="small"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          value={postComment}
                          onChange={(e) => setPostComment(e.target.value)}
                          onKeyDown={(e) => handleSubmitPostComment(e.key)}
                        />
                      </Stack>
                    )
                  }
                </Accordion>
              </Stack>
            </PinText>
          </Grid>
        </Grid>
      )}

      {
        otherPins && otherPins.length > 0 ? (
          <>
            <Typography variant="h5" component="div" mb={2} sx={{textAlign: "center"}}>
              More like this
            </Typography>

            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {
                otherPins.map(otherPin => (
                  <PinCard
                    key={otherPin._id}
                  >
                    <Link
                      className="react-link"
                      to={`/pinDetail/${otherPin._id}`}
                      state={{category: otherPin.category}}
                    >
                      <div className="pin-cover">
                        <img
                          className="pin-img"
                          src={otherPin.imgUrl}
                          alt="Pin"
                        />
                        <div className="pin-hover">
                          <div className="btn-groups">
                            <IconButton
                              className="btn-download"
                              sx={{p: 0}}
                              onClick={(e) => handleDownloadPin(
                                otherPin.imgUrl,
                                otherPin.imgUrl.split('/').splice(2).pop().substring(0, otherPin.imgUrl.length - 4),
                                e
                              )}
                            >
                              <Avatar sx={{ bgcolor: "#ffffff", width: 30, height: 30}}>
                                <DownloadIcon fontSize="small" style={{color: grey[900]}}/>
                              </Avatar>
                            </IconButton>
                            <Button className="btn-save" sx={{height: 30}} variant="contained" disableElevation>
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link to={`/profile/${otherPin.creator._id}`} className="react-link">
                      <div className="pin-creator">
                        <Stack direction="row" spacing={2} sx={{m: 1}}>
                          <Avatar
                            src={otherPin.creator.thumbnail}
                            alt={otherPin.creator.username}
                            sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }}
                          >
                            {otherPin.creator.username.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle1" component="div" mt={1}>
                            {otherPin.creator.username}
                          </Typography>
                        </Stack>
                      </div>
                    </Link>
                  </PinCard>
                ))
              }
            </Masonry>
          </>
        ) : (
          <Typography variant="h5" align="center" gutterBottom component="div">
            No related pins
          </Typography>
        )
      }
    </Box>
  )
}

export default PinDetail;