import axios from "axios";

const API_IMG_URL = "https://api.cloudinary.com/v1_1/ishare/image/";
const API_PIN_URL = "https://ishare-v1.herokuapp.com/api/pins";

class PinService {

  getToken() {
    let token;
    if(localStorage.getItem("user")) {
      return token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = '';
      return token;
    }
  }

  verify(formObj) {
    const token = this.getToken();
    return axios.post(
      `${API_PIN_URL}/pinverify`,
      formObj,
      { headers: { Authorization: token } }
    );
  }

  verifyImage(image) {
    const fileType = image["type"];
    const fileSize = image["size"];
    const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

    if (!validImageTypes.includes(fileType)) {
      // invalid file type code goes here.
      return { result: "fail", msg: "This file type is not supported" }
    }

    // limit size < 10MB
    if(fileSize > 10485760) {
      return { result: "fail", msg: "This file is too large" }
    }

    return { result: "success", msg: "This file type is supported" }
  }

  upload(reqObj) {
    const data = new FormData()
    data.append("file", reqObj.image);
    data.append("upload_preset", "iSHARE");
    data.append("cloud_name", "ishare");
    data.append("folder", "iSHARE_Pin");

    return axios.post(`${API_IMG_URL}upload`, data);
  }

  create(pinObj) {
    const token = this.getToken();
    return axios.post(
      API_PIN_URL,
      pinObj,
      { headers: { Authorization: token } }
    );
  }

  getPins() {
    const token = this.getToken();
    return axios.get( API_PIN_URL, { headers: { Authorization: token } } );
  }

  getPin(pinID) {
    const token = this.getToken();
    return axios.get( `${API_PIN_URL}/${pinID}`, { headers: { Authorization: token } } );
  }

  getCreatedPin(creatorID) {
    const token = this.getToken();
    return axios.get( `${API_PIN_URL}/profile/${creatorID}`, { headers: { Authorization: token } } );
  }

  getCategory(category) {
    const token = this.getToken();
    return axios.get( `${API_PIN_URL}/category/${category}`, { headers: { Authorization: token } } );
  }

  savePin(_id, user_id) {
    const token = this.getToken();
    return axios.post(
      `${API_PIN_URL}/saved`,
      { _id, user_id },
      { headers: { Authorization: token } }
    );
  }

  getSavedPin(user_id) {
    const token = this.getToken();
    return axios.get( `${API_PIN_URL}/saved/${user_id}`, { headers: { Authorization: token } } );
  }

  searchPins(search_input) {
    const token = this.getToken();
    return axios.post(
      `${API_PIN_URL}/search`,
      { search_input },
      { headers: { Authorization: token } }
    );
  }

  downloadPin(pinUrl, pinTitle) {
    axios.get(pinUrl, {responseType: 'blob'}).then((res) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', pinTitle);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  deleteSavedPin(pin_id) {
    const token = this.getToken();
    return axios.delete(
      `${API_PIN_URL}/saved`,
      {
        headers: { Authorization: token },
        data: { pin_id }
      }
    )
  }

  postComment(postObj) {
    const token = this.getToken();
    return axios.post(
      `${API_PIN_URL}/comment`,
      postObj,
      { headers: { Authorization: token } }
    )
  }
}

export default new PinService();