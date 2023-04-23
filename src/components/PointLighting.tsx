import { TransformControls, useHelper } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import useDebouncy from 'use-debouncy/lib/effect'

export type PointLightingProps = {
  pointLightingData: Array<{
    position?: THREE.Vector3
    intensity?: number
    color?: string
    distance?: number
  }>
  setPointLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        intensity?: number | undefined
        color?: string | undefined
        distance?: number | undefined
      }[]
    >
  >
  selectedPointLight: number
}

export type PointLightProps = {
  id: number
  position?: THREE.Vector3
  intensity?: number
  color?: string
  distance?: number
  selected?: boolean
  setPointLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        intensity?: number | undefined
        color?: string | undefined
        distance?: number | undefined
      }[]
    >
  >
}

export default function PointLighting(props: PointLightingProps) {
  function PointLight(props: PointLightProps) {
    const [positionCurrent, setPositionCurrent] = useState<
      THREE.Vector3 | undefined
    >(props.position)

    const lightRef = useRef<any>()
    useHelper(
      props.selected && lightRef,
      THREE.PointLightHelper,
      props.distance,
      props.color,
    )

    useDebouncy(
      () => {
        props.setPointLighting(
          (
            prevState: Array<{
              position?: THREE.Vector3
              intensity?: number
              color?: string
              distance?: number
            }>,
          ) => {
            const newState = prevState.map(
              (
                item: {
                  position?: THREE.Vector3 | undefined
                  intensity?: number | undefined
                  color?: string | undefined
                  distance?: number | undefined
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
        <pointLight
          ref={lightRef}
          position={props.position}
          intensity={props.intensity}
          color={props.color}
          distance={props.distance}
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
      {props.pointLightingData.map(
        (
          data: {
            position?: THREE.Vector3
            intensity?: number
            color?: string
            distance?: number
          },
          i: number,
        ) => (
          <PointLight
            key={i}
            id={i}
            position={data.position}
            intensity={data.intensity}
            color={data.color}
            distance={data.distance}
            selected={i === props.selectedPointLight}
            setPointLighting={props.setPointLighting}
          />
        ),
      )}
    </>
  )
}
