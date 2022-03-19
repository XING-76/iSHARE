import { useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LandscapeIcon from '@mui/icons-material/Landscape';
import TourIcon from '@mui/icons-material/Tour';
import PaletteIcon from '@mui/icons-material/Palette';
import SportsIcon from '@mui/icons-material/Sports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PetsIcon from '@mui/icons-material/Pets';
import MoreIcon from '@mui/icons-material/More';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { deepPurple, red, grey } from '@mui/material/colors';
// sweetalert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// Styled
import { Pinbox, PinForm } from './index.styles';
// Service
import PinService from '../../services/pin.service';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#000000',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#000000',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#000000',
    },
    '&:hover fieldset': {
      borderColor: '#000000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
    },
  },
});

const categories = [
  { text: "Cars", icon: <DirectionsCarIcon/>},
  { text: "Food", icon: <RestaurantIcon/>},
  { text: "Nature", icon: <LandscapeIcon/>},
  { text: "Travel", icon: <TourIcon/>},
  { text: "Art", icon: <PaletteIcon/>},
  { text: "Sport", icon: <SportsIcon/>},
  { text: "Fitness", icon: <FitnessCenterIcon/>},
  { text: "Animals", icon: <PetsIcon/>},
  { text: "Others", icon: <MoreIcon/>}
]


const CreatePin = (props) => {
  const { currentUser, setPins } = props;

  const navigate = useNavigate();

  const CustomSwal = withReactContent(Swal);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [category, setCategory] = useState("Others");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadInput = async (e) => {
    try {
      const res = await PinService.verifyImage(e.target.files[0]);
      if(res.result === "success") {
        setImage(e.target.files[0]);
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
        setMessage("");
      } else {
        setMessage(res.msg);
      }
    } catch (err) {
      setMessage(err.msg);
    }
  }

  const handleUploadImage = () => {
    let formObj = { title, description, destinationLink, category };
    let reqObj = { ...formObj, image, imgUrl: "" };

    setLoading(true);

    CustomSwal
      .fire({
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Create',
        confirmButtonColor: red[600],
        cancelButtonColor: grey[500],
        title: "Create the Pin?",
        text: "You won't be able to revert this!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          PinService.verify(formObj)
          .then(() => {
            setMessage("");
            PinService.upload(reqObj)
              .then(data => {
                const { title, description, destinationLink, category } = formObj;
                const { url } = data.data;
                let pinObj = {title, description, destinationLink, category, imgUrl: url};
                PinService.create(pinObj)
                  .then(() => {
                    setLoading(false);
                    CustomSwal
                      .fire({
                        icon: 'success',
                        title: "New pin has been created",
                        showConfirmButton: false,
                        timer: 1500
                      })
                      .then(() => {
                        PinService.getPins()
                        .then(res => {
                          setPins(res.data);
                          navigate('/');
                        })
                        .catch(e => console.log(e))
                      })
                  })
                  .catch((err) => {
                    setMessage(err.response.data);
                    setLoading(false);
                  })
              })
              .catch(() => {
                setMessage("Please upload your image");
                setLoading(false);
              })
          })
          .catch(err => {
            setMessage(err.response.data);
            setLoading(false);
          })
        } else {
          setLoading(false);
        }
      })
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "90%",
        margin: "auto",
        marginTop: "1rem",
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "1.5rem"
      }}
    >
      <Grid container>
        <Grid item sm={12} md={6} style={{width: "inherit", padding: ".5rem"}}>
          <Pinbox style={{position: "relative", height: "100%", backgroundColor: "#E0E0E0"}}>
            {
              image === "" ?
              (
                <>
                  <label className="upload-groups" htmlFor="contained-button-file">
                    <Stack spacing={2} sx={{
                      border: "2px dotted black",
                      height: "100%",
                      borderRadius: ".5rem",
                      padding: "3rem",
                      justifyContent: "space-around"
                    }}>
                      <IconButton aria-label="upload" size="large" sx={{flexDirection: "column"}}>
                        <FileUploadIcon />
                        <Typography variant="subtitle1" component="p" mt={1}>
                          Click to upload
                        </Typography>
                      </IconButton>
                      <Typography variant="subtitle1" mt={1} component="p">
                        Recommendation: Use high-quality JPG, JPEG, PNG, GIF less than 20MB
                      </Typography>
                    </Stack>
                  </label>
                  <input
                    type="file"
                    className="upload-input"
                    name="file"
                    id="contained-button-file"
                    onChange={handleUploadInput}
                  />
                </>
              ) :
              (
                <>
                  <img src={previewImage} className="upload-img" alt="upload-img" />
                  <IconButton
                    aria-label="delete"
                    sx={{
                      color: red[500],
                      position: "absolute", bottom: ".5rem", right: ".5rem"
                    }}
                    onClick={() => setImage("")}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </>
              )
            }
          </Pinbox>
        </Grid>
        <Grid item sm={12} md={6}>
          <PinForm>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              mb={2}
            >
              <CssTextField
                id="custom-css-outlined-input"
                label="Title"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                fullWidth
                onChange={e => setTitle(e.target.value)}
              />
              <Stack direction="row" spacing={2} sx={{m: 1}}>
                <div className="user-show">
                  <Avatar
                    alt="profile-avatar"
                    src={currentUser?.user.thumbnail}
                    sx={{
                      bgcolor: deepPurple[500],
                      fontSize: "1.25rem"
                    }}
                  >
                    {currentUser?.user.username.charAt(0)}
                  </Avatar>
                </div>
                <div className="user-show">
                  <Typography variant="subtitle1" component="p" mt={.6}>
                    {currentUser?.user.username}
                  </Typography>
                </div>
              </Stack>
              <CssTextField
                id="custom-css-outlined-input"
                label="Description"
                InputLabelProps={{ shrink: true, }}
                margin="normal"
                fullWidth
                multiline
                rows={4}
                onChange={e => setDescription(e.target.value)}
              />
              <CssTextField
                id="custom-css-outlined-input"
                label="Destination link"
                variant="standard"
                InputLabelProps={{ shrink: true, }}
                margin="normal"
                fullWidth
                onChange={e => setDestinationLink(e.target.value)}
              />
              <CssTextField
                id="create-pin-category"
                label="Category"
                variant="outlined"
                InputLabelProps={{ shrink: true, }}
                margin="normal"
                fullWidth
                select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.text} value={category.text}>
                    {category.icon}
                    <Typography variant="body2" sx={{paddingLeft: "1rem"}}>
                      {category.text}
                    </Typography>
                  </MenuItem>
                ))}
              </CssTextField>
            </Box>
            {
              message && (<Alert severity="error" sx={{marginBottom: "1rem"}}>{message}</Alert>)
            }
            <div className="save-btn">
              <LoadingButton
                variant="contained"
                color="error"
                disableElevation
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                onClick={handleUploadImage}
                sx={{ textTransform: "none" }}
              >
                Save
              </LoadingButton>
            </div>
          </PinForm>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreatePin;