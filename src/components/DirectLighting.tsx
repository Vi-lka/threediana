import { TransformControls, useHelper } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
// import { DirectionalLightShadow } from 'three';
import useDebouncy from 'use-debouncy/lib/effect'

export type DirectLightingProps = {
  directLightingData: Array<{
    position?: THREE.Vector3
    intensity?: number
    color?: string
  }>
  setDirectLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        rotation?: THREE.Euler | undefined
        intensity?: number | undefined
        color?: string | undefined
      }[]
    >
  >
  selectedDirectLight: number
}

export type DirLightProps = {
  id: number
  position?: THREE.Vector3
  intensity?: number
  color?: string
  selected?: boolean
  setDirectLighting: React.Dispatch<
    React.SetStateAction<
      {
        position?: THREE.Vector3 | undefined
        rotation?: THREE.Euler | undefined
        intensity?: number | undefined
        color?: string | undefined
      }[]
    >
  >
}

export default function DirectLighting(props: DirectLightingProps) {
  function DirLight(props: DirLightProps) {
    const [positionCurrent, setPositionCurrent] = useState<
      THREE.Vector3 | undefined
    >(props.position)

    const lightRef = useRef<any>()
    useHelper(
      props.selected && lightRef,
      THREE.DirectionalLightHelper,
      1,
      props.color,
    )

    useDebouncy(
      () => {
        props.setDirectLighting(
          (
            prevState: Array<{
              position?: THREE.Vector3
              intensity?: number
              color?: string
            }>,
          ) => {
            const newState = prevState.map(
              (
                item: {
                  position?: THREE.Vector3 | undefined
                  intensity?: number | undefined
                  color?: string | undefined
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
        <directionalLight
          ref={lightRef}
          position={props.position}
          intensity={props.intensity}
          color={props.color}
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
      {props.directLightingData.map(
        (
          data: {
            position?: THREE.Vector3
            intensity?: number
            color?: string
          },
          i: number,
        ) => (
          <DirLight
            key={i}
            id={i}
            position={data.position}
            intensity={data.intensity}
            color={data.color}
            selected={i === props.selectedDirectLight}
            setDirectLighting={props.setDirectLighting}
          />
        ),
      )}
    </>
  )
}
