import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Image,
  Box,
  Button,
  Flex,
  Select,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { HexColorInput } from 'react-colorful'
import AddTexture from './AddTexture'
import DebouncedPicker from './DebouncedPicker'

export type TexturesSettingsProps = {
  material: string
  selectedMaterial: string

  colors: Array<{ material: string | undefined; color: string | undefined }>
  setColors: React.Dispatch<
    React.SetStateAction<
      {
        material: string | undefined
        color: string | undefined
      }[]
    >
  >

  colorMapsURLs: Array<{ material: string | undefined; url: string | null }>
  setcolorMapsURLs: React.Dispatch<
    React.SetStateAction<
      {
        material: string | undefined
        url: string | null
      }[]
    >
  >

  normalMapsURLs: Array<{ material: string | undefined; url: string | null }>
  setnormalMapsURLs: React.Dispatch<
    React.SetStateAction<
      {
        material: string | undefined
        url: string | null
      }[]
    >
  >
}

export default function TexturesSettings(props: TexturesSettingsProps) {
  function handleChangeColor(newColor: string | undefined) {
    const nextColors = props.colors.map(colorItem => {
      if (colorItem.material === props.material) {
        return {
          ...colorItem,
          color: newColor,
        }
      }
      return colorItem
    })
    props.setColors(nextColors)
  }

  const presetColors = [
    '#ffffff',
    '#EEEEEE',
    '#848484',
    '#D0A282',
    '#cd9323',
    '#8d2808',
  ]

  const colorItem = props.colors.find(item => {
    return item.material === props.material
  })

  const colorMapUrl = props.colorMapsURLs.find(item => {
    return item.material === props.material
  })

  const normalMapURL = props.normalMapsURLs.find(item => {
    return item.material === props.material
  })

  if (props.selectedMaterial !== props.material) {
    return null
  }

  return (
    <Accordion allowMultiple>
      <Flex flexDirection="column" alignItems="center">
        <AccordionItem width="100%">
          <AccordionButton
            flexWrap="wrap"
            pt={4}
            pb={4}
            border="1px solid rgba(32, 32, 32, 0.2)"
            borderRadius={8}
            _expanded={{
              bg: 'blue.500',
              color: 'white',
              borderRadius: '0',
            }}
          >
            <Box flex="1" textAlign="left" mr={0.5}>
              <b>Color</b>
            </Box>
            {colorItem?.color !== undefined && (
              <Box
                w="35px"
                h="35px"
                minW="35px"
                minH="35px"
                margin="0 4px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                boxShadow="0px 0px 6px 0px rgba(34, 60, 80, 0.2)"
                bg={colorItem?.color}
              />
            )}
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pt={3} pb={3}>
            <Box w="100%" className="hexColorInput">
              <DebouncedPicker
                color={colorItem?.color}
                onChange={newColor => handleChangeColor(newColor)}
                wait={100}
              />
              <Flex
                justifyContent={'center'}
                w={'100%'}
                p={3}
                pb={0}
                wrap="wrap"
              >
                {presetColors.map(presetColor => (
                  <Button
                    key={presetColor}
                    w="24px"
                    maxW="24px"
                    h="24px"
                    maxH="24px"
                    m="2px"
                    p="0"
                    border="1px solid"
                    borderColor="gray.400"
                    borderRadius="4px"
                    style={{ background: presetColor }}
                    onClick={() => handleChangeColor(presetColor)}
                  />
                ))}
              </Flex>
              <HexColorInput
                color={colorItem?.color}
                onChange={newColor => handleChangeColor(newColor)}
                prefixed
              />

              {colorItem?.color !== undefined && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  title="Delete"
                  onClick={() => handleChangeColor(undefined)}
                >
                  <Image
                    src={'/img/deleteicon.png'}
                    className="delete_icon"
                    alt="Delete"
                  />
                </Button>
              )}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Flex>
      <AddTexture
        Name={'Base Color Map'}
        MapURL={colorMapUrl ? colorMapUrl.url : ''}
        htmlForID="base_color_map"
        handleOnChange={e => {
          if (e.target.files) {
            props.setcolorMapsURLs([
              ...props.colorMapsURLs,
              {
                material: props.material,
                url: URL.createObjectURL(e.target.files[0]),
              },
            ])
          }

          e.target.value = ''
        }}
        handleDeleteMap={() => {
          props.setcolorMapsURLs(
            props.colorMapsURLs.filter(
              item => item.material !== props.material,
            ),
          )
        }}
      />

      <AddTexture
        Name={'Normal Map'}
        MapURL={normalMapURL ? normalMapURL.url : ''}
        htmlForID="normal_map"
        handleOnChange={e => {
          if (e.target.files) {
            props.setnormalMapsURLs([
              ...props.normalMapsURLs,
              {
                material: props.material,
                url: URL.createObjectURL(e.target.files[0]),
              },
            ])
          }

          e.target.value = ''
        }}
        handleDeleteMap={() => {
          props.setnormalMapsURLs(
            props.normalMapsURLs.filter(
              item => item.material !== props.material,
            ),
          )
        }}
      />

      {/* <AddTexture
          Name={'Metalness Map'}
          MapURL={metalnessMapURL}
          htmlForID="metalness_map"
          handleOnChange={(e) => {
            e.target.files && setmetalnessMap(e.target.files[0])
            e.target.files &&
              setmetalnessMapURL(
                URL.createObjectURL(e.target.files[0])
              )
            e.target.value = ''
          }}
          handleDeleteMap={() => {
            setmetalnessMap(null)
            setmetalnessMapURL('')
          }}
          settings={true}
          htmlForIDSetting="metalness_value"
          settingsValue={metalness}
          setSettingsValue={setMetalness}
      />

      <AddTexture
          Name={'Roughness Map'}
          MapURL={roughnessMapURL}
          htmlForID="roughness_map"
          handleOnChange={(e) => {
            e.target.files && setroughnessMap(e.target.files[0])
            e.target.files &&
              setroughnessMapURL(
                URL.createObjectURL(e.target.files[0])
              )
            e.target.value = ''
          }}
          handleDeleteMap={() => {
            setroughnessMap(null)
            setroughnessMapURL('')
          }}
          settings={true}
          htmlForIDSetting="roughness_value"
          settingsValue={roughness}
          setSettingsValue={setRoughness}
      />

      <AddTexture
          Name={'Ambient Occlusion Map'}
          MapURL={aoMapURL}
          htmlForID="ao_map"
          handleOnChange={(e) => {
            e.target.files && setaoMap(e.target.files[0])
            e.target.files &&
              setaoMapURL(URL.createObjectURL(e.target.files[0]))
            e.target.value = ''
          }}
          handleDeleteMap={() => {
            setaoMap(null)
            setaoMapURL('')
          }}
          settings={true}
          htmlForIDSetting="ao_value"
          settingsValue={aoIntensity}
          setSettingsValue={setaoIntensity}
      /> */}
    </Accordion>
  )
}
