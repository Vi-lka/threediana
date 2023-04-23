import { TransformControls, useHelper } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import useDebouncy from 'use-debouncy/lib/effect'

export type SpotLightingProps = {
  spotLightingData: Array<{
    position?: THREE.Vector3
    intensity?: number
    color?: string
    distance?: number
    angle?: number
  }>
  setSpotLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        intensity?: number | undefined
        color?: string | undefined
        distance?: number | undefined
        angle?: number | undefined
      }[]
    >
  >
  selectedSpotLight: number
}

export type SpotLightProps = {
  id: number
  position?: THREE.Vector3
  intensity?: number
  color?: string
  distance?: number
  angle?: number
  selected?: boolean
  setSpotLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        intensity?: number | undefined
        color?: string | undefined
        distance?: number | undefined
        angle?: number | undefined
      }[]
    >
  >
}

export default function SpotLighting(props: SpotLightingProps) {
  function SpotLight(props: SpotLightProps) {
    const [positionCurrent, setPositionCurrent] = useState<
      THREE.Vector3 | undefined
    >(props.position)

    const lightRef = useRef<any>()
    useHelper(props.selected && lightRef, THREE.SpotLightHelper, props.color)

    useDebouncy(
      () => {
        props.setSpotLighting(
          (
            prevState: Array<{
              position?: THREE.Vector3
              intensity?: number
              color?: string
              distance?: number
              angle?: number
            }>,
          ) => {
            const newState = prevState.map(
              (
                item: {
                  position?: THREE.Vector3 | undefined
                  intensity?: number | undefined
                  color?: string | undefined
                  distance?: number | undefined
                  angle?: number | undefined
                },
                index: number,
              ) => {
                if (index === props.id) {
                  return { ...item, position: positionCurrent }
                }

                return item
              },
            )

            return newState
          },
        )
      },
      100,
      [lightRef.current?.position],
    )

    return (
      <>
        <spotLight
          ref={lightRef}
          position={props.position}
          intensity={props.intensity}
          color={props.color}
          distance={props.distance}
          angle={props.angle}
          penumbra={0.5}
          decay={1}
        />
        <TransformControls
          showX={props.selected}
          showY={props.selected}
          showZ={props.selected}
          enabled={props.selected}
          object={lightRef}
          mode={'translate'}
          onMouseUp={() => setPositionCurrent(lightRef.current.position)}
        />
      </>
    )
  }

  return (
    <>
      {props.spotLightingData.map(
        (
          data: {
            position?: THREE.Vector3
            intensity?: number
            color?: string
            distance?: number
            angle?: number
          },
          i: number,
        ) => (
          <SpotLight
            key={i}
            id={i}
            position={data.position}
            intensity={data.intensity}
            color={data.color}
            distance={data.distance}
            angle={data.angle}
            selected={i === props.selectedSpotLight}
            setSpotLighting={props.setSpotLighting}
          />
        ),
      )}
    </>
  )
}
