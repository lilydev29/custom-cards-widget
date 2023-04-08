/** @jsx figma.widget.h */

import { once, showUI } from '@create-figma-plugin/utilities'

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu } = widget
const { Image, Frame } = widget

export default function () {
  widget.register(Notepad)
}

function Notepad() {

  const [textFront, setTextFront] = useSyncedState('textFront', 'Front')
  const [textBack, setTextBack] = useSyncedState('textBack', 'Back')
  const [imageFrontBase64, setImageFrontBase64] = useSyncedState('imageFrontBase64', '')
  const [imageBackBase64, setImageBackBase64] = useSyncedState('imageBackBase64', '')
  const [flipped, setFlipped] = useSyncedState('flipped', false)

  const [imageFrontDimensions, setImageFrontDimensions] = useSyncedState<number[]>('imageFrontDimensions', [])
  const [imageBackDimensions, setImageBackDimensions] = useSyncedState<number[]>('imageBackDimensions', [])

  const items: Array<WidgetPropertyMenuItem> = [
    {
      itemType: 'action',
      propertyName: 'edit',
      tooltip: 'Edit'
    },
    {
      itemType: 'action',
      propertyName: 'flip',
      tooltip: 'Flip'
    }
  ]

  var imageFrontPaint = ''

  async function onChange({ propertyName }: WidgetPropertyEvent): Promise<void> {
    await new Promise<void>(function (resolve: () => void): void {

      if (propertyName === 'edit') {
        showUI({ height: 350, width: 400 }, { textFront, textBack, imageFrontBase64, imageBackBase64, imageFrontDimensions, imageBackDimensions })

        once('UPDATE_TEXT', function ({ textFront, textBack, imageFrontBase64, imageBackBase64, imageFrontDimensions, imageBackDimensions }: { textFront: string, textBack: string, imageFrontBase64: string, imageBackBase64: string, imageFrontDimensions: [number, number], imageBackDimensions: [number, number]}): void {
          setTextFront(textFront)
          setTextBack(textBack)
          setImageFrontBase64(imageFrontBase64)
          setImageBackBase64(imageBackBase64)
          setImageFrontDimensions(imageFrontDimensions)
          setImageBackDimensions(imageBackDimensions)

          // Create the front and back image paints.
          var imageFrontPaint:WidgetJSX.ImagePaint = {
            type: 'image',
            scaleMode: 'fit', // CHOOSE FIT OR FILL HERE IN THE FUTURE
            src: imageFrontBase64
          }

          resolve()
        })

      }

      if (propertyName === 'flip') {
        // TODO: flip a toggle value
        if (!flipped) {
          setFlipped(true)
        } else {
          setFlipped(false)
        }

        resolve()

      }
    })
  }

  usePropertyMenu(items, onChange)

  return (
    <AutoLayout
      direction="vertical"
      effect={{
        blur: 8,
        color: { a: 0.1, b: 0, g: 0, r: 0 },
        offset: { x: 0, y: 3 },
        spread: 0,
        type: 'drop-shadow'
      }}
      // TODO: custom backgrounds (colors, lines/ruling)
      fill="#FFF6E7"
      height={216}
      width={360}
      horizontalAlignItems="center"
      padding={8}
      spacing={8}
      verticalAlignItems="center"
    >
      {/* <AutoLayout
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
      > */}

        {(!flipped && imageFrontBase64 && imageFrontBase64 != '') ?
          (<Image
            //Pass a data url directly as the image
            // src={imageFrontBase64}
            src={imageFrontBase64}
            width={'fill-parent'} // TODO CHANGE?
            height={'fill-parent'} // TODO CHANGE?
            // width={imageFrontDimensions[0]} // TODO CHANGE?
            // height={imageFrontDimensions[1]} // TODO CHANGE?
          />)
          :
          (null)
        }

        {(flipped && imageBackBase64 && imageBackBase64 != '') ?
          (<Image
            //Pass a data url directly as the image
            src={imageBackBase64}
            width={'fill-parent'} // TODO CHANGE?
            height={'fill-parent'} // TODO CHANGE?
            // width={imageBackDimensions[0]} // TODO CHANGE?
            // height={imageBackDimensions[1]} // TODO CHANGE?
          />)
          :
          (null)
        }

        {!flipped ? (
          textFront.split('\n').map((line) => {
            return line ? (
              // TODO: Custom Text parameter
              <Text fontSize={12} horizontalAlignText="center" width="fill-parent">
                {line}
              </Text>

            ) : null
          })
        ) : (
          textBack.split('\n').map((line) => {
            return line ? (
              // TODO: Custom Text parameter
              <Text fontSize={12} horizontalAlignText="center" width="fill-parent">
                {line}
              </Text>

            ) : null
          })
        )}


      {/* </AutoLayout> */}
    </AutoLayout>
  )
}
