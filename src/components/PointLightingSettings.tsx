import { AddIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { HexColorInput } from 'react-colorful'
import { useDebouncyFn } from 'use-debouncy'
import DebouncedPicker from './DebouncedPicker'

export type PointLightingSettingsProps = {
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
  setSelectedPointLight: React.Dispatch<React.SetStateAction<number>>

  handlePlacePointLight: () => void
  handleDeletePointLight: (i: number) => void
}

export default function PointLightingSettings(
  props: PointLightingSettingsProps,
) {
  const handleChangeColor = useDebouncyFn((id: number, val?: string) => {
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
            if (index === id) {
              return { ...item, color: val }
            }

            return item
          },
        )
        return newState
      },
    )
  }, 100)

  function DebounceIntensity({
    id,
    intensity,
  }: {
    id: number
    intensity?: number
  }) {
    const [intensityCurrent, setIntensityCurrent] = useState<
      number | undefined
    >(intensity)

    const handleChangeIntensity = (value: number) => {
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
              if (index === id) {
                return { ...item, intensity: value }
              }

              return item
            },
          )

          return newState
        },
      )
    }

    return (
      <>
        <Slider
          min={0}
          max={5}
          step={0.1}
          flex="1"
          mb="14px"
          mr="6px"
          width="calc(100% - 12px)"
          value={intensityCurrent}
          onChange={(value: number) => setIntensityCurrent(value)}
          onChangeEnd={(value: number) => handleChangeIntensity(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb fontSize="xs" boxSize="28px">
            {intensityCurrent}
          </SliderThumb>
        </Slider>
      </>
    )
  }

  function DebounceDistance({
    id,
    distance,
  }: {
    id: number
    distance?: number
  }) {
    const [distanceCurrent, setDistanceCurrent] = useState<number | undefined>(
      distance,
    )

    const handleChangeDistance = (value: number) => {
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
              if (index === id) {
                return { ...item, distance: value }
              }

              return item
            },
          )

          return newState
        },
      )
    }

    return (
      <>
        <Slider
          min={1}
          max={20}
          step={1}
          flex="1"
          mb="14px"
          mr="6px"
          width="calc(100% - 12px)"
          value={distanceCurrent}
          onChange={(value: number) => setDistanceCurrent(value)}
          onChangeEnd={(value: number) => handleChangeDistance(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb fontSize="xs" boxSize="28px">
            {distanceCurrent}
          </SliderThumb>
        </Slider>
      </>
    )
  }

  return (
    <Accordion
      allowToggle
      index={props.selectedPointLight}
      onChange={index => {
        props.setSelectedPointLight(Number(index))
      }}
    >
      <Tooltip label="Добавить" fontSize="md">
        <Button
          w="100%"
          textAlign="center"
          mb={3}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={props.handlePlacePointLight}
        >
          <AddIcon boxSize={6} p={1} />
        </Button>
      </Tooltip>

      <Flex
        direction="column"
        alignItems="flex-end"
        mb={3}
        border="1px solid rgba(32, 32, 32, 0.2)"
        borderRadius={10}
        p={2}
      >
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
            <AccordionItem key={i} width="100%" mt={1} mb={1}>
              <AccordionButton
                pt={2}
                pb={2}
                bg="gray.200"
                _expanded={{ bg: 'blue.300', color: 'white' }}
              >
                <Flex flex="1" fontSize="16px">
                  <Text>{i + 1}</Text>
                </Flex>
                <Tooltip label="Удалить" fontSize="sm">
                  <Image
                    src={'/img/deleteicon.png'}
                    className="delete_icon"
                    alt="Delete"
                    title="Delete"
                    onClick={() => {
                      props.handleDeletePointLight(i)
                    }}
                  />
                </Tooltip>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt={3} pb={3}>
                <Flex
                  direction="column"
                  alignItems="flex-end"
                  mb="20px"
                  border="1px solid rgba(32, 32, 32, 0.2)"
                  borderRadius={10}
                  p={3}
                >
                  <Badge>Intensity:</Badge>
                  <DebounceIntensity id={i} intensity={data.intensity} />

                  <Badge>Distance:</Badge>
                  <DebounceDistance id={i} distance={data.distance} />

                  <Badge>Color:</Badge>
                  <Box w="100%" className="hexColorInput">
                    <DebouncedPicker
                      color={data.color}
                      onChange={(val?: string) => handleChangeColor(i, val)}
                      wait={100}
                    />
                    <HexColorInput
                      color={data.color}
                      onChange={(val: string) => handleChangeColor(i, val)}
                      prefixed
                    />
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ),
        )}
      </Flex>
    </Accordion>
  )
}
