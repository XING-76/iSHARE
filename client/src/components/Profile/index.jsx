import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { deepPurple, red, grey } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
// sweetalert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// Style
import { PinCard } from '../Pin/index.styles';
import Masonry from 'react-masonry-css';
// Service
import AuthService from '../../services/auth.service';
import PinService from "../../services/pin.service";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Profile = (props) => {
  const { currentUser, handleDownloadPin, handleSavePin } = props;

  const [createdToggle, setCreatedToggle] = useState("warning");
  const [savedToggle, setSavedToggle] = useState("inherit");
  const [fabType, setFabType] = useState("Created");
  const [createdPins, setCreatedPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);
  const [profileDetail, setProfileDetail] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const { creatorID } = params;

  const CustomSwal = withReactContent(Swal);

  useEffect(() => {
    getProfileRandomImg();
    getProfileDetail();
    getCreatedPins();
    getProfileSavedPins();
  }, [creatorID])

  const getProfileDetail = () => {
    AuthService.getProfileUser(creatorID)
      .then(res => setProfileDetail(res.data))
      .catch(() => navigate('/notfound'))
  }

  const getProfileSavedPins = () => {
    PinService.getSavedPin(creatorID)
      .then(res => setSavedPins(res.data))
      .catch(e => console.log(e))
  }

  const getCreatedPins = () => {
    PinService.getCreatedPin(creatorID)
      .then(res => setCreatedPins(res.data))
      .catch(e => console.log(e))
  }

  const getProfileRandomImg = () => {
    const id = Math.floor(Math.random() * 1000);
    fetch(`https://source.unsplash.com/random/1600x500?sig=${id}`)
     .then((res) => {
        setProfileImg(res.url);
        setLoading(false);
      })
      .catch(() => getProfileRandomImg())
  }

  const handleDeleteSavedPin = (pin_id, e) => {
    e.preventDefault();
    CustomSwal
      .fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: red[600],
        cancelButtonColor: grey[500],
        title: "Delete the Pin?",
      })
      .then((result) => {
        if (result.isConfirmed) {
          PinService.deleteSavedPin(pin_id)
            .then(res => {
              CustomSwal
                .fire({
                  icon: 'success',
                  title: res.data,
                  showConfirmButton: false,
                  timer: 1500
                })
                .then(() => getProfileSavedPins())
            })
            .catch(e => console.log(e))
        }
      })
  }

  const handleFabToggle = (e) => {
    if(e.target.outerText === "Created") {
      setCreatedToggle("warning");
      setSavedToggle("inherit");
      setFabType("Created");
      getCreatedPins();
    } else {
      setSavedToggle("warning");
      setCreatedToggle("inherit");
      setFabType("Saved");
      getProfileSavedPins();
    }
  }

  const handleSignOut = () => {
    CustomSwal
      .fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sign out',
        confirmButtonColor: red[600],
        cancelButtonColor: grey[500],
        title: "Sure to Sign out?",
      })
      .then((result) => {
        if (result.isConfirmed) {
          AuthService.signout();
          CustomSwal
            .fire({
              icon: 'success',
              title: "Sign Out successfully!",
              showConfirmButton: false,
              timer: 2000
            })
            .then(() => {
              navigate('/sign');
            })
        }
      })
  }

  return (
      <>
        {
          loading ? (<LinearProgress color="error" />) : (
            <Box>
              {
                profileDetail && profileDetail.username && (
                  <Stack alignItems="center">
                    <div className="profile-img" style={{position: "relative", width: "100%"}}>
                      <img
                        src={profileImg}
                        alt="profile-img"
                        style={{width: "100%", minHeight: "350px"}}
                      />
                      <IconButton aria-label="signout" color="error"
                        sx={{
                          bgcolor: "#fff",
                          boxShadow: 1,
                          position: "absolute",
                          top: ".8rem",
                          right: ".8rem",
                          transition: ".8s",
                          ":hover": {bgcolor: "#fcfcfc", opacity: ".9"}
                        }}
                        onClick={handleSignOut}
                      >
                        <LogoutIcon />
                      </IconButton>
                    </div>
                    <Avatar
                      alt="profile-avatar"
                      src={profileDetail.thumbnail}
                      sx={{
                        bgcolor: deepPurple[500],
                        fontSize: "2.5rem",
                        width: "5rem",
                        height: "5rem",
                        marginTop: "-3rem",
                        boxShadow: 2
                      }}
                    >
                      {profileDetail.username.charAt(0)}
                    </Avatar>
                    <Typography variant="h4" gutterBottom component="div" mt={1}>
                      {profileDetail.username}
                    </Typography>
                  </Stack>
                )
              }
              <Stack direction="row" justifyContent="center" spacing={2} mb={6}>
                <Fab variant="extended"
                  sx={{textTransform: "none"}}
                  color={createdToggle} onClick={(e) => handleFabToggle(e)}
                >
                  Created
                </Fab>
                <Fab variant="extended"
                  sx={{textTransform: "none"}}
                  color={savedToggle} onClick={(e) => handleFabToggle(e)}
                >
                  Saved
                </Fab>
              </Stack>

              {
                fabType === "Created" ? (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    style={{padding: ".8rem"}}
                  >
                    {
                      createdPins.map(createdPin => (
                        <PinCard
                          key={createdPin._id}
                        >
                          <Link
                            className="react-link"
                            to={`/pinDetail/${createdPin._id}`}
                            state={{category: createdPin.category}}
                          >
                            <div className="pin-cover">
                              <img
                                className="pin-img"
                                src={createdPin.imgUrl}
                                alt="Pin"
                              />
                              <div className="pin-hover">
                                <div className="btn-groups">
                                  <IconButton
                                    className="btn-download"
                                    sx={{p: 0}}
                                    onClick={(e) => handleDownloadPin(
                                      createdPin.imgUrl,
                                      createdPin.imgUrl.split('/').splice(2).pop().substring(0, createdPin.imgUrl.length - 4),
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
                                    onClick={(e) => handleSavePin(createdPin._id, e)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <Link to={`/profile/${createdPin.creator._id}`} className="react-link">
                            <div className="pin-creator">
                              <Stack direction="row" spacing={2} sx={{m: 1}}>
                                <Avatar
                                  src={createdPin.creator.thumbnail}
                                  alt={createdPin.creator.username}
                                  sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }}
                                >
                                  {createdPin.creator.username.charAt(0)}
                                </Avatar>
                                <Typography variant="subtitle1" component="div" mt={1}>
                                  {createdPin.creator.username}
                                </Typography>
                              </Stack>
                            </div>
                          </Link>
                        </PinCard>
                      ))
                    }
                  </Masonry>
                ) : (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    style={{padding: ".8rem"}}
                  >
                    {
                      savedPins.map(savedPin => (
                        <PinCard
                          key={savedPin._id}
                        >
                          <Link
                            className="react-link"
                            to={`/pinDetail/${savedPin._id}`}
                            state={{category: savedPin.category}}
                          >
                            <div className="pin-cover">
                              <img
                                className="pin-img"
                                src={savedPin.imgUrl}
                                alt="Pin"
                              />
                              <div className="pin-hover">
                                <div className="btn-groups">
                                  <IconButton
                                    className="btn-download"
                                    sx={{p: 0}}
                                    onClick={(e) => handleDownloadPin(
                                      savedPin.imgUrl,
                                      savedPin.imgUrl.split('/').splice(2).pop().substring(0, savedPin.imgUrl.length - 4),
                                      e
                                    )}
                                  >
                                    <Avatar sx={{ bgcolor: "#ffffff", width: 30, height: 30}}>
                                      <DownloadIcon fontSize="small" style={{color: grey[900]}}/>
                                    </Avatar>
                                  </IconButton>
                                  {
                                    currentUser.user._id === creatorID ? (
                                      <Button
                                        className="btn-delete"
                                        variant="contained"
                                        disableElevation
                                        sx={{height: 30}}
                                        onClick={(e) => handleDeleteSavedPin(savedPin._id, e)}
                                      >
                                        Delete
                                      </Button>
                                    ) : (
                                      <Button
                                        className="btn-delete"
                                        variant="contained"
                                        disableElevation
                                        sx={{height: 30}}
                                        onClick={(e) => handleSavePin(savedPin._id, e)}
                                      >
                                        Save
                                      </Button>
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          </Link>
                          <Link to={`/profile/${savedPin.creator._id}`} className="react-link">
                            <div className="pin-creator">
                              <Stack direction="row" spacing={2} sx={{m: 1}}>
                                <Avatar
                                  src={savedPin.creator.thumbnail}
                                  alt={savedPin.creator.username}
                                  sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }}
                                >
                                  {savedPin.creator.username.charAt(0)}
                                </Avatar>
                                <Typography variant="subtitle1" component="div" mt={1}>
                                  {savedPin.creator.username}
                                </Typography>
                              </Stack>
                            </div>
                          </Link>
                        </PinCard>
                      ))
                    }
                  </Masonry>
                )
              }
              
            </Box>
          )
        }
      </>
  )
}

export default Profile;