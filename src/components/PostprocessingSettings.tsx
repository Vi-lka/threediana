import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
} from '@chakra-ui/react'
import { BlendFunction } from 'postprocessing'
import React, { useState } from 'react'
import * as THREE from 'three'
import useDebouncy from 'use-debouncy/lib/effect'

export type PostprocessingSettingsProps = {
  bloom: {
    enabled: boolean
    intensity: number //Range is [0, 10]
    luminanceThreshold: number //Range is [0, 1]
    luminanceSmoothing: number //Range is [0, 1]
  }
  setBloom: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      intensity: number
      luminanceThreshold: number
      luminanceSmoothing: number
    }>
  >

  brightnessContrast: {
    enabled: boolean
    opacity: number //Range is [0, 1]
    brightness: number //Range is [-1, 1]
    contrast: number //Range is [-1, 1]
  }
  setBrightnessContrast: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      opacity: number
      brightness: number
      contrast: number
    }>
  >

  chromaticAberration: {
    enabled: boolean
    offset: THREE.Vector2
  }
  setChromaticAberration: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      offset: THREE.Vector2
    }>
  >

  depthOfField: {
    enabled: boolean
    focusDistance: number //Range is [0, 1]
    focalLength: number //Range is [0, 1]
    bokehScale: number //Range is [0, 10]
  }
  setDepthOfField: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      focusDistance: number
      focalLength: number
      bokehScale: number
    }>
  >

  ssao: {
    enabled: boolean
    blendFunction: BlendFunction // Use ALPHA or NORMAL to see the effect // MULTIPLY SUBTRACT OVERLAY
    radius: number //Range [0.001, 1]
    bias: number //Range [0.001, 0.1]
    intensity: number //Range [0, 5]
  }
  setSSAO: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      blendFunction: BlendFunction
      radius: number
      bias: number
      intensity: number
    }>
  >

  toneMapping: {
    enabled: boolean
    middleGrey: number //Range is [-1, 1]
    maxLuminance: number //Range is [0, 20]
  }
  setToneMapping: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      middleGrey: number
      maxLuminance: number
    }>
  >

  vignette: {
    enabled: boolean
    offset: number //Range is [-1, 1]
    darkness: number //Range is [0, 1]
  }
  setVignette: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean
      offset: number
      darkness: number
    }>
  >
}

export default function PostprocessingSettings(
  props: PostprocessingSettingsProps,
) {
  const [bloom, setBloom] = useState(props.bloom)
  const [brightnessContrast, setBrightnessContrast] = useState(
    props.brightnessContrast,
  )
  const [chromaticAberration, setChromaticAberration] = useState(
    props.chromaticAberration,
  )
  const [depthOfField, setDepthOfField] = useState(props.depthOfField)
  const [ssao, setSSAO] = useState(props.ssao)
  const [toneMapping, setToneMapping] = useState(props.toneMapping)
  const [vignette, setVignette] = useState(props.vignette)

  function Debounce(
    func: React.Dispatch<React.SetStateAction<any>>,
    updatedValue: any,
    deps: number,
  ) {
    useDebouncy(
      () => {
        func((value: any) => ({
          ...value,
          ...updatedValue,
        }))
      },
      200,
      [deps],
    )
  }

  Debounce(props.setBloom, { intensity: bloom.intensity }, bloom.intensity)
  Debounce(
    props.setBloom,
    { luminanceThreshold: bloom.luminanceThreshold },
    bloom.luminanceThreshold,
  )
  Debounce(
    props.setBloom,
    { luminanceSmoothing: bloom.luminanceSmoothing },
    bloom.luminanceSmoothing,
  )

  Debounce(
    props.setBrightnessContrast,
    { opacity: brightnessContrast.opacity },
    brightnessContrast.opacity,
  )
  Debounce(
    props.setBrightnessContrast,
    { brightness: brightnessContrast.brightness },
    brightnessContrast.brightness,
  )
  Debounce(
    props.setBrightnessContrast,
    { contrast: brightnessContrast.contrast },
    brightnessContrast.contrast,
  )

  Debounce(
    props.setChromaticAberration,
    {
      offset: new THREE.Vector2(
        chromaticAberration.offset.x,
        chromaticAberration.offset.y,
      ),
    },
    chromaticAberration.offset.x,
  )
  Debounce(
    props.setChromaticAberration,
    {
      offset: new THREE.Vector2(
        chromaticAberration.offset.x,
        chromaticAberration.offset.y,
      ),
    },
    chromaticAberration.offset.y,
  )

  Debounce(
    props.setDepthOfField,
    { focusDistance: depthOfField.focusDistance },
    depthOfField.focusDistance,
  )
  Debounce(
    props.setDepthOfField,
    { focalLength: depthOfField.focalLength },
    depthOfField.focalLength,
  )
  Debounce(
    props.setDepthOfField,
    { bokehScale: depthOfField.bokehScale },
    depthOfField.bokehScale,
  )

  Debounce(props.setSSAO, { radius: ssao.radius }, ssao.radius)
  Debounce(props.setSSAO, { bias: ssao.bias }, ssao.bias)
  Debounce(props.setSSAO, { intensity: ssao.intensity }, ssao.intensity)

  Debounce(
    props.setToneMapping,
    { middleGrey: toneMapping.middleGrey },
    toneMapping.middleGrey,
  )
  Debounce(
    props.setToneMapping,
    { maxLuminance: toneMapping.maxLuminance },
    toneMapping.maxLuminance,
  )

  Debounce(props.setVignette, { offset: vignette.offset }, vignette.offset)
  Debounce(
    props.setVignette,
    { darkness: vignette.darkness },
    vignette.darkness,
  )

  return (
    <>
      <Box
        id="PostprocessingSettings"
        className="editForm3DSettings"
        maxH="80vh"
        h="80vh"
        paddingRight="0.5rem"
        overflowY="scroll"
      >
        <Accordion allowMultiple>
          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Bloom</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idBloom"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.bloom.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setBloom((bloom: any) => ({
                      ...bloom,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idBloom">
                  {props.bloom.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Intensity:</Badge>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={bloom.intensity}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { intensity: value }
                    setBloom((bloom: any) => ({
                      ...bloom,
                      ...updatedValue,
                    }))
                  }}
                  // onChangeEnd={(value: number) => {
                  //   let updatedValue = {};
                  //   updatedValue = {intensity: value};
                  //   props.setBloom((bloom: any) => ({
                  //       ...bloom,
                  //       ...updatedValue
                  //   }))
                  // }}
                  isDisabled={!props.bloom.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {bloom.intensity}
                  </SliderThumb>
                </Slider>

                <Badge>Luminance Threshold:</Badge>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={bloom.luminanceThreshold}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { luminanceThreshold: value }
                    setBloom((bloom: any) => ({
                      ...bloom,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.bloom.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {bloom.luminanceThreshold}
                  </SliderThumb>
                </Slider>

                <Badge>Luminance Smoothing:</Badge>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={bloom.luminanceSmoothing}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { luminanceSmoothing: value }
                    setBloom((bloom: any) => ({
                      ...bloom,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.bloom.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {bloom.luminanceSmoothing}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Brightness/Contrast</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idBrightnessContrast"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.brightnessContrast.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setBrightnessContrast((brightnessContrast: any) => ({
                      ...brightnessContrast,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idBrightnessContrast">
                  {props.brightnessContrast.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Opacity:</Badge>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={brightnessContrast.opacity}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { opacity: value }
                    setBrightnessContrast((brightnessContrast: any) => ({
                      ...brightnessContrast,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.brightnessContrast.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {brightnessContrast.opacity}
                  </SliderThumb>
                </Slider>

                <Badge>Brightness:</Badge>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={brightnessContrast.brightness}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { brightness: value }
                    setBrightnessContrast((brightnessContrast: any) => ({
                      ...brightnessContrast,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.brightnessContrast.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {brightnessContrast.brightness}
                  </SliderThumb>
                </Slider>

                <Badge>Contrast:</Badge>
                <Slider
                  min={-1}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={brightnessContrast.contrast}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { contrast: value }
                    setBrightnessContrast((brightnessContrast: any) => ({
                      ...brightnessContrast,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.brightnessContrast.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {brightnessContrast.contrast}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              minH={92}
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Chromatic Aberration</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idChromaticAberration"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.chromaticAberration.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setChromaticAberration(
                      (chromaticAberration: any) => ({
                        ...chromaticAberration,
                        ...updatedValue,
                      }),
                    )
                  }}
                />
                <label htmlFor="idChromaticAberration">
                  {props.chromaticAberration.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>X:</Badge>
                <Slider
                  min={-0.01}
                  max={0.01}
                  step={0.001}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={chromaticAberration.offset.x}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = {
                      offset: new THREE.Vector2(
                        value,
                        chromaticAberration.offset.y,
                      ),
                    }
                    setChromaticAberration((chromaticAberration: any) => ({
                      ...chromaticAberration,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.chromaticAberration.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {chromaticAberration.offset.x}
                  </SliderThumb>
                </Slider>

                <Badge>Y:</Badge>
                <Slider
                  min={-0.01}
                  max={0.01}
                  step={0.001}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={chromaticAberration.offset.y}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = {
                      offset: new THREE.Vector2(
                        chromaticAberration.offset.x,
                        value,
                      ),
                    }
                    setChromaticAberration((chromaticAberration: any) => ({
                      ...chromaticAberration,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.chromaticAberration.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {chromaticAberration.offset.y}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Depth Of Field</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idDepthOfField"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.depthOfField.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setDepthOfField((depthOfField: any) => ({
                      ...depthOfField,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idDepthOfField">
                  {props.depthOfField.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Focus Distance:</Badge>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={depthOfField.focusDistance}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { focusDistance: value }
                    setDepthOfField((depthOfField: any) => ({
                      ...depthOfField,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.depthOfField.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {depthOfField.focusDistance}
                  </SliderThumb>
                </Slider>

                <Badge>Focal Length:</Badge>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={depthOfField.focalLength}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { focalLength: value }
                    setDepthOfField((depthOfField: any) => ({
                      ...depthOfField,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.depthOfField.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {depthOfField.focalLength}
                  </SliderThumb>
                </Slider>

                <Badge>Scale:</Badge>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={depthOfField.bokehScale}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { bokehScale: value }
                    setDepthOfField((depthOfField: any) => ({
                      ...depthOfField,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.depthOfField.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {depthOfField.bokehScale}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>SSAO</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idSSAO"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.ssao.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setSSAO((ssao: any) => ({
                      ...ssao,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idSSAO">
                  {props.ssao.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Blend Function:</Badge>
                <RadioGroup
                  alignSelf="flex-start"
                  size="md"
                  mt="4px"
                  mb="14px"
                  ml="10px"
                  value={`${props.ssao.blendFunction}`}
                  defaultValue={`${props.ssao.blendFunction}`}
                  onChange={(value: string) => {
                    let updatedValue = {}
                    updatedValue = { blendFunction: Number(value) }
                    props.setSSAO((ssao: any) => ({
                      ...ssao,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.ssao.enabled}
                >
                  <Stack>
                    <Radio value={`${BlendFunction.MULTIPLY}`}>MULTIPLY</Radio>
                    <Radio value={`${BlendFunction.SUBTRACT}`}>SUBTRACT</Radio>
                    <Radio value={`${BlendFunction.OVERLAY}`}>OVERLAY</Radio>
                    <Divider />
                    <Radio value={`${BlendFunction.NORMAL}`}>NORMAL</Radio>
                    <Radio value={`${BlendFunction.ALPHA}`}>ALPHA</Radio>
                  </Stack>
                </RadioGroup>

                <Badge>Radius:</Badge>
                <Slider
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={ssao.radius}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { radius: value }
                    setSSAO((ssao: any) => ({
                      ...ssao,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.ssao.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {ssao.radius}
                  </SliderThumb>
                </Slider>

                <Badge>Bias:</Badge>
                <Slider
                  min={0.001}
                  max={0.05}
                  step={0.001}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={ssao.bias}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { bias: value }
                    setSSAO((ssao: any) => ({
                      ...ssao,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.ssao.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {ssao.bias}
                  </SliderThumb>
                </Slider>

                <Badge>Intensity:</Badge>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={ssao.intensity}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { intensity: value }
                    setSSAO((ssao: any) => ({
                      ...ssao,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.ssao.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {ssao.intensity}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Tone Mapping</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idToneMapping"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.toneMapping.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setToneMapping((toneMapping: any) => ({
                      ...toneMapping,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idToneMapping">
                  {props.toneMapping.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Middle Grey:</Badge>
                <Slider
                  min={-1}
                  max={1}
                  step={0.1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={toneMapping.middleGrey}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { middleGrey: value }
                    setToneMapping((toneMapping: any) => ({
                      ...toneMapping,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.toneMapping.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {toneMapping.middleGrey}
                  </SliderThumb>
                </Slider>

                <Badge>Max Luminance:</Badge>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={toneMapping.maxLuminance}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { maxLuminance: value }
                    setToneMapping((toneMapping: any) => ({
                      ...toneMapping,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.toneMapping.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {toneMapping.maxLuminance}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="100%">
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Vignette</b>
              </Box>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mr={2}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={12}
              >
                <Switch
                  id="idVignette"
                  size="md"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.vignette.enabled}
                  onChange={e => {
                    let updatedValue = {}
                    updatedValue = { enabled: e.target.checked }
                    props.setVignette((vignette: any) => ({
                      ...vignette,
                      ...updatedValue,
                    }))
                  }}
                />
                <label htmlFor="idVignette">
                  {props.vignette.enabled ? 'ON' : 'OFF'}
                </label>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="column"
                alignItems="flex-end"
                mb="20px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
              >
                <Badge>Offset:</Badge>
                <Slider
                  min={-1}
                  max={1}
                  step={0.1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={vignette.offset}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { offset: value }
                    setVignette((vignette: any) => ({
                      ...vignette,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.vignette.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {vignette.offset}
                  </SliderThumb>
                </Slider>

                <Badge>Darkness:</Badge>
                <Slider
                  min={-1}
                  max={1}
                  step={0.1}
                  flex="1"
                  mb="14px"
                  mr="6px"
                  width="calc(100% - 12px)"
                  focusThumbOnChange={false}
                  value={vignette.darkness}
                  onChange={(value: number) => {
                    let updatedValue = {}
                    updatedValue = { darkness: value }
                    setVignette((vignette: any) => ({
                      ...vignette,
                      ...updatedValue,
                    }))
                  }}
                  isDisabled={!props.vignette.enabled}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="xs" boxSize="28px">
                    {vignette.darkness}
                  </SliderThumb>
                </Slider>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  )
}
