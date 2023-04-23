import React, { createRef, useState } from 'react'
import * as THREE from 'three'
import { Html, Image as DreiImage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Box } from '@chakra-ui/react'
// import { Box } from '@chakra-ui/layout'

export type AnnotationsMapProps = {
  range: number
  annotationIcon: string
  annotationsData: Array<{
    position?: THREE.Vector3
    title?: string
    info?: string
  }>
  scale: number
  sceneSize: THREE.Vector3
  textHoverEnter?: React.PointerEventHandler<HTMLDivElement>
  textHoverLeave?: React.PointerEventHandler<HTMLDivElement>
  opacity?: number
  annotationMode?: boolean
  handleSelectAnnotation: (value: number) => void
  selectedAnnotation?: number
  handleImgAnnotationHoverEnter: (i: number) => void
  handleImgAnnotationHoverLeave: (i: number) => void
}

export default function AnnotationsMap(props: AnnotationsMapProps) {
  const stateThree = useThree()

  const [controlsChange, setControlsChange] = useState(false)

  const [annotations] = useState(props.annotationsData)

  const textPos =
    (props.sceneSize.x + props.sceneSize.y + props.sceneSize.z) / 3 / 20

  const annotationsIconsRefs = annotations.map(() =>
    createRef<
      THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
    >(),
  )
  const annotationsTextRefs = annotations.map(() => createRef<HTMLDivElement>())

  function handleOnStartControls() {
    setControlsChange(true)
  }

  function handleOnEndControls() {
    setControlsChange(false)
  }

  function handleAnnotationsTextClassList(
    element: React.RefObject<HTMLDivElement>,
    index: number,
  ) {
    // Open Last Annotation
    if (
      !controlsChange &&
      props.range > 0 &&
      index === props.range - 1 &&
      index === props.selectedAnnotation
    ) {
      element.current?.classList.add('visible')
    } else {
      element.current?.classList.remove('visible')
    }

    // Open Selected Annotation
    if (
      !controlsChange &&
      props.range > 0 &&
      index === props.selectedAnnotation
    ) {
      element.current?.classList.add('visible')
    } else {
      element.current?.classList.remove('visible')
    }

    // Close All Annotation if not annotationMode
    if (!props.annotationMode) {
      element.current?.classList.remove('visible')
    }
  }

  stateThree.controls?.addEventListener('start', handleOnStartControls)

  useFrame(state => {
    annotationsIconsRefs.forEach(
      (
        element: React.RefObject<
          THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
        >,
      ) => element.current?.lookAt(state.camera.position),
    )

    annotationsTextRefs.forEach(handleAnnotationsTextClassList)
  })

  return (
    <>
      {annotations.map(
        (
          data: {
            position?: THREE.Vector3 | undefined
            title?: string | undefined
            info?: string | undefined
          },
          i: number,
        ) => (
          <DreiImage
            visible={props.annotationMode}
            key={i}
            ref={annotationsIconsRefs[i]}
            url={props.annotationIcon}
            position={data.position}
            scale={props.scale}
            transparent
            opacity={props.opacity}
            onPointerOver={e => {
              e.stopPropagation()
              if (props.annotationMode) {
                annotationsIconsRefs[i].current?.scale.set(
                  props.scale * 1.3,
                  props.scale * 1.3,
                  1,
                )
                props.handleImgAnnotationHoverEnter(i)
              }
            }}
            onPointerOut={e => {
              e.stopPropagation()
              if (props.annotationMode) {
                annotationsIconsRefs[i].current?.scale.set(
                  props.scale,
                  props.scale,
                  1,
                )
                props.handleImgAnnotationHoverLeave(i)
              }
            }}
            onClick={e => {
              e.stopPropagation()
              if (props.annotationMode) {
                props.handleSelectAnnotation(i)
                handleOnEndControls()
              }
            }}
          />
        ),
      )}
      {annotations.map(
        (
          data: {
            position?: THREE.Vector3 | undefined
            title?: string | undefined
            info?: string | undefined
          },
          i: number,
        ) => (
          <Html
            visible={props.annotationMode}
            key={i}
            position={
              data.position
                ? [data.position.x, data.position.y - textPos, data.position.z]
                : undefined
            }
            as="div"
          >
            <Box
              ref={annotationsTextRefs[i]}
              className="annotation"
              onPointerOver={props.textHoverEnter}
              onPointerOut={props.textHoverLeave}
            >
              <Box bottom="0">
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  <b>{data.title}</b>
                </p>
                <p style={{ fontSize: '11px' }}>{data.info}</p>
              </Box>
            </Box>
          </Html>
        ),
      )}
    </>
  )
}
