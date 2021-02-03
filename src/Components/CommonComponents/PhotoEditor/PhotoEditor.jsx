import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import classes from './PhotoEditor.module.css'

const ImageCrop = ({ imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange, isLoadingPhoto }) => (
  <div className={classes.avatar}>
    <AvatarEditor image={imageSrc}
      border={50}
      scale={scaleValue / 3}
      rotate={0}
      ref={setEditorRef} />
    <div className={classes.range_input_container}>
      <label className={classes.scale_input_label} for={'scale_input'}>Изменить масштаб</label>
      <input id={"scale_input"} className={classes.scale_input} type="range" value={scaleValue} name="points" min="4" max="20" onChange={onScaleChange} />
    </div>
    <button disabled={isLoadingPhoto} className={classes.oncrop_button} onClick={onCrop}>
      Сохранить
    </button>
  </div>

)

class PhotoEditor extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedImage: null,
      userProfilePic: '',
      editor: null,
      scaleValue: 4,
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
      console.log()
      this.props.updatePhotoTC(this.dataURLtoFile(url, 'new.png'))
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
        this.setState({ warning_message: "Неверный формат файла" })
      } else {
        if (fileChangeEvent.target.files[0].size > 4000000) {
          this.setState({ warning_message: 'Файл слишком большой', selectedImage: null })
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
            <span>Выберите фото</span>
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



export default PhotoEditor