import * as THREE from 'three'
import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  SSAO,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import React from 'react'
import { BlendFunction } from 'postprocessing'

export type PostprocessingProps = {
  bloom: {
    enabled: boolean
    intensity: number //Range is [0, 10]
    luminanceThreshold: number //Range is [0, 1]
    luminanceSmoothing: number //Range is [0, 1]
  }
  brightnessContrast: {
    enabled: boolean
    opacity: number //Range is [0, 1]
    brightness: number //Range is [-1, 1]
    contrast: number //Range is [-1, 1]
  }
  chromaticAberration: {
    enabled: boolean
    offset: THREE.Vector2
  }
  depthOfField: {
    enabled: boolean
    focusDistance: number //Range is [0, 1]
    focalLength: number //Range is [0, 1]
    bokehScale: number //Range is [0, 10]
  }
  ssao: {
    enabled: boolean
    blendFunction: BlendFunction // Use ALPHA or NORMAL to see the effect // MULTIPLY SUBTRACT OVERLAY
    radius: number //Range [0.001, 1]
    bias: number //Range [0.001, 0.1]
    intensity: number //Range [0, 5]
  }
  toneMapping: {
    enabled: boolean
    middleGrey: number //Range is [-1, 1]
    maxLuminance: number //Range is [0, 20]
  }
  vignette: {
    enabled: boolean
    offset: number //Range is [-1, 1]
    darkness: number //Range is [0, 1]
  }
}

export default function Postprocessing(props: PostprocessingProps) {
  return (
    <EffectComposer>
      {props.bloom.enabled ? (
        <Bloom
          intensity={props.bloom.intensity}
          luminanceThreshold={props.bloom.luminanceThreshold}
          luminanceSmoothing={props.bloom.luminanceSmoothing}
        />
      ) : (
        <></>
      )}
      {props.brightnessContrast.enabled ? (
        <BrightnessContrast
          opacity={props.brightnessContrast.opacity}
          brightness={props.brightnessContrast.brightness} // brightness. min: -1, max: 1
          contrast={props.brightnessContrast.contrast} // contrast: min -1, max: 1
        />
      ) : (
        <></>
      )}
      {props.chromaticAberration.enabled ? (
        <ChromaticAberration
          offset={props.chromaticAberration.offset} // color offset
        />
      ) : (
        <></>
      )}
      {props.depthOfField.enabled ? (
        <DepthOfField
          focusDistance={props.depthOfField.focusDistance} // where to focus
          focalLength={props.depthOfField.focalLength} // focal length
          bokehScale={props.depthOfField.bokehScale} // bokeh size
        />
      ) : (
        <></>
      )}
      {props.ssao.enabled ? (
        <SSAO
          blendFunction={props.ssao.blendFunction} // Use ALPHA or NORMAL to see the effect // MULTIPLY SUBTRACT OVERLAY
          samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={7}
          radius={props.ssao.radius} // occlusion sampling radius
          bias={props.ssao.bias} // occlusion bias
          intensity={props.ssao.intensity}
        />
      ) : (
        <></>
      )}
      {props.toneMapping.enabled ? (
        <ToneMapping
          middleGrey={props.toneMapping.middleGrey} // middle grey factor
          maxLuminance={props.toneMapping.maxLuminance} // maximum luminance
        />
      ) : (
        <></>
      )}
      {props.vignette.enabled ? (
        <Vignette
          offset={props.vignette.offset} // vignette offset
          darkness={props.vignette.darkness} // vignette darkness
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
