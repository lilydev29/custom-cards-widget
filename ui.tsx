import {
  Button,
  Container,
  FileUploadDropzone,
  render,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
  Text, Muted, IconCross32
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import styles from './styles.css'

function Plugin(props: { textFront: string, textBack: string, imageFrontBase64: string, imageBackBase64: string, imageFrontDimensions: number[], imageBackDimensions: number[] }) {

  function FileUpload(props: {imageString: string, side: string}) {

    function handleSelectedFiles(files: Array<File>) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          // convert image file to base64 string
          const imageString = reader.result as string;

          var image = new Image();
          image.src = imageString;
          image.onload = function() {
            props.side == 'front' ? (setImageFrontDimensions([image.width, image.height])) : (setImageBackDimensions([image.width, image.height]));
          };

          if (imageString) {
            if(imageString !== imageFrontBase64) {
              if (props.side == 'front') {
                setImageFrontBase64(imageString)
              }
              if (props.side == 'back') {
                setImageBackBase64(imageString)
              }
              // handleUpdateButtonClick()
            }
          }
        },
        false
      );
      if (files[0]) {
        reader.readAsDataURL(files[0]);
      }
    }

    if (props.imageString == '') {
      return (
        <FileUploadDropzone
          onSelectedFiles={handleSelectedFiles}
        >
          <Text align="center">
            <Muted>Click or Drop Your Image Here</Muted>
          </Text>

        </FileUploadDropzone>
      )
    }

    if (props.imageString && props.imageString !== '') {
      return (
        <Fragment>
          <div className={styles.uploadedFileArea}>
            <Text align="center">
              <Muted>Remove Image</Muted>
            </Text>
            <IconCross32 />
          </div>
        </Fragment>
      )
    }

    return null

  }

  // rgb(230,230,230), dashed, 1px
  // 11px
  // 368px wide, 72px tall

  const [textFront, setTextFront] = useState(props.textFront)
  const [textBack, setTextBack] = useState(props.textBack)

  const [imageFrontBase64, setImageFrontBase64] = useState(props.imageFrontBase64)
  const [imageBackBase64, setImageBackBase64] = useState(props.imageBackBase64)

  const [imageFrontDimensions, setImageFrontDimensions] = useState(props.imageFrontDimensions)
  const [imageBackDimensions, setImageBackDimensions] = useState(props.imageBackDimensions)

  const handleUpdateButtonClick = useCallback(
    function () {
      emit('UPDATE_TEXT', { textFront, textBack, imageFrontBase64, imageBackBase64, imageFrontDimensions, imageBackDimensions})
    },
    [{ textFront, textBack, imageFrontBase64, imageBackBase64, imageFrontDimensions, imageBackDimensions }]
  )

  // const acceptedFileTypes = ['image/x-png', 'image/gif', 'image/jpeg']

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <TextboxMultiline
        {...useInitialFocus()}
        onValueInput={setTextFront}
        value={textFront}
        variant="border"
      />
      <VerticalSpace space="large" />
      <TextboxMultiline
        onValueInput={setTextBack}
        value={textBack}
        variant="border"
      />
      <VerticalSpace space="large" />

      <FileUpload side={'front'} imageString={imageFrontBase64} />
      <FileUpload side={'back'} imageString={imageBackBase64} />


      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleUpdateButtonClick}>
        Update Text
      </Button>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
