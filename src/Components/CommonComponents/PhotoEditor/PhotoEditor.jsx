import React, {useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import { withPreloader } from '../../../HOC/withPreloader';
import Modal from '../Modal/Modal';
import { PreloaderPageWithoutHeader } from '../PreloaderPage/PreloaderPage';
import classes from './PhotoEditor.module.css'

class PhotoEditor extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedImage: null,
      userProfilePic: '',
      editor: null,
      scaleValue: 2,
      warning_message: null,
      save_button_disabled: false
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.active !== prevProps.active) {
      if (!this.props.active) this.setState({ warning_message: null, selectedImage: null })
    }
    if (this.props.isLoadingPhoto !== prevProps.isLoadingPhoto) {
      this.setState({ save_button_disabled: this.props.isLoadingPhoto })
    }

  }

  setEditorRef = editor => this.setState({ editor });

  onCrop = () => {
    const { editor } = this.state;
    if (editor !== null) {
      const url = editor.getImageScaledToCanvas().toDataURL();
      let img = new Image()
      img.src = url
      this.props.updatePhotoTC(this.dataURLtoFile(url, 'new.png'))
      this.props.set_upload_mode(false)
    }
  };

  onScaleChange = (scaleChangeEvent) => {
    const scaleValue = parseFloat(scaleChangeEvent.target.value);
    this.setState({ scaleValue });
  };

  dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  profilePicChange = (fileChangeEvent) => {
    const file = fileChangeEvent.target.files[0]
    if (file) {
      const { type } = file;
      if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg'))) {
        this.setState({ warning_message: "Incorrect file format" })
      } else {
        if (fileChangeEvent.target.files[0].size > 4000000) {
          this.setState({ warning_message: 'Too big size', selectedImage: null })
        } else this.setState({ openCropper: true, selectedImage: fileChangeEvent.target.files[0], fileUploadErrors: [], warning_message: null })
      }
    }
  }

  render() {
    return (
      <div>
        <div className={classes.input_file_wrapper}>
          <input className={classes.photo_input}
            id="input_file"
            type="file"
            name="profilePicBtn"
            accept="image/png, image/jpeg, image/jpg"
            onChange={this.profilePicChange} />
          <label for="input_file" className={classes.input_photo_label}>
            <span>Select the photo</span>
          </label>
          {this.state.warning_message && <div className={classes.warning_message}>{this.state.warning_message}</div>}
        </div>
        {this.state.selectedImage &&
          <ImageCrop
            isLoadingPhoto={this.state.save_button_disabled}
            imageSrc={this.state.selectedImage}
            setEditorRef={this.setEditorRef}
            onCrop={this.onCrop}
            scaleValue={this.state.scaleValue}
            onScaleChange={this.onScaleChange}
          />
        }
      </div>
    )
  }
}

const ImageCrop = ({ imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange, isLoadingPhoto }) => (
  <div className={classes.avatar}>
    <AvatarEditor image={imageSrc}
      border={30}
      scale={scaleValue / 3}
      rotate={0}
      ref={setEditorRef} />
    <div className={classes.range_input_container}>
      <label className={classes.scale_input_label} for={'scale_input'}>Scale</label>
      <input id={"scale_input"} className={classes.scale_input} type="range" value={scaleValue} name="points" min="2" max="8" onChange={onScaleChange} />
    </div>
    <button disabled={isLoadingPhoto} className={classes.oncrop_button} onClick={onCrop}>
      Save
    </button>
  </div>
)

// type UploadNewPhotoWindow = {
//     updatePhotoTC: (photo_file: File) => void
//     active: boolean | null
//     isLoadingPhoto: boolean
// }

// const UploadNewPhotoWindow: React.FC<UploadNewPhotoWindow> = ({updatePhotoTC, active, isLoadingPhoto}) => {
//     return (
//         <div className = {classes.upload_new_photo_window}>
//             <div className = {classes.signing_block}>You can upload JPG, JPEG or PNG file (size less than 4MB).</div>
//             <PhotoEditor updatePhotoTC = {updatePhotoTC}
//                          active = {active}
//                          isLoadingPhoto = {isLoadingPhoto}/>
//         </div>
// )}

const UploadNewPhotoWindow = ({ set_upload_mode, upload_mode, updatePhotoTC, active, isLoadingPhoto }) => {
  return (
    <Modal close_modal={set_upload_mode}
      active={upload_mode}>
      <div className={classes.upload_new_photo_window}>
        <div className={classes.signing_block}>You can upload JPG, JPEG or PNG file (size less than 4MB).</div>
        <PhotoEditor updatePhotoTC={updatePhotoTC}
          set_upload_mode = {set_upload_mode}
          active={active}
          isLoadingPhoto={isLoadingPhoto} />
      </div>
    </Modal>
  )
}

let ProfileAvatar = ({ photo_url, default_photo_url, cb }) => {
  let avatar_photo_url = photo_url ? photo_url : default_photo_url
  return (
      <div>
          <img src={avatar_photo_url} alt={'avatar'} />
          <button onClick={() => cb(true)}>Edit</button>
      </div>
  )
}

ProfileAvatar = withPreloader(PreloaderPageWithoutHeader, 'isLoadingPhoto')(ProfileAvatar)

const AvatarComonent = ({updatePhotoTC, photo_url, isLoadingPhoto, default_photo_url}) => {
  const [upload_mode, set_upload_mode] = useState(false)
  return (
    <div>
      <ProfileAvatar photo_url={photo_url}
        isLoadingPhoto = {isLoadingPhoto}
        default_photo_url = {default_photo_url}
        cb={set_upload_mode} />
      <UploadNewPhotoWindow updatePhotoTC={updatePhotoTC}
        set_upload_mode={set_upload_mode}
        upload_mode={upload_mode}
        active={upload_mode}
        isLoadingPhoto={isLoadingPhoto} />
    </div>

  )
}

export default AvatarComonent