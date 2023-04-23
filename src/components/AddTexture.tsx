import React, { useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import useDebouncy from 'use-debouncy/lib/effect'

export type AddTextureProps = {
  Name: string
  MapURL: string | null
  htmlForID: string
  handleOnChange: React.ChangeEventHandler<HTMLInputElement>
  handleDeleteMap: React.MouseEventHandler<HTMLButtonElement>
  settings?: boolean
  htmlForIDSetting?: string
  settingsValue?: string
  setSettingsValue?: React.Dispatch<React.SetStateAction<string>>
}

export default function AddTexture(props: AddTextureProps) {
  const [settingsValue, setSettingsValue] = useState<number>(
    Number(props.settingsValue),
  )

  useDebouncy(
    () => {
      props.setSettingsValue && props.setSettingsValue(settingsValue.toString())
    },
    100,
    [settingsValue],
  )

  return (
    <>
      <Flex flexDirection="column" alignItems="center">
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
              <b>{props.Name}</b>
            </Box>
            {props.MapURL && (
              <Image className="fileInputImgmap" src={props.MapURL} alt="" />
            )}
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pt={6} pb={6}>
            {props.MapURL ? (
              <Image src={props.MapURL} alt="" />
            ) : (
              <>
                <label className="fileInputLabelmap" htmlFor={props.htmlForID}>
                  <AddIcon
                    w={7}
                    h={7}
                    margin="5px"
                    bgColor="gray.600"
                    padding="5px"
                    borderRadius="6px"
                    color="white"
                    className="fileInputLabelmapAddIcon"
                    _hover={{
                      color: 'white',
                      bgColor: 'blue.500',
                      padding: '6px',
                      borderRadius: '10px',
                      transition: ' 0.15s ease-in-out',
                    }}
                    transition={'ease-in-out 0.2s'}
                  />
                  Add
                </label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png"
                  id={props.htmlForID}
                  style={{ display: 'none' }}
                  onChange={props.handleOnChange}
                />
              </>
            )}

            {props.settings && (
              <>
                <label
                  className="InputLabelmap"
                  htmlFor={props.htmlForIDSetting}
                >
                  Изменить:
                </label>
                <div className="InputDiv">
                  <Box pl={2} pr={2} width="100%">
                    <Slider
                      id={props.htmlForIDSetting}
                      min={0}
                      max={1}
                      step={0.01}
                      focusThumbOnChange={false}
                      value={Number(settingsValue)}
                      onChange={setSettingsValue}
                    >
                      <SliderTrack bg="gray.200">
                        <SliderFilledTrack bg="blue.500" />
                      </SliderTrack>
                      <SliderThumb fontSize="xs" boxSize="28px">
                        {settingsValue}
                      </SliderThumb>
                    </Slider>
                  </Box>

                  {/* <NumberInput  
                                    minW='60px'
                                    maxW='75px'
                                    width='25%' 
                                    ml='2px' 
                                    size='xs'
                                    verticalAlign='center'
                                    id={props.htmlForIDSetting}
                                    value={props.settingsValue} 
                                    min={0} 
                                    max={1} 
                                    step={0.1}
                                    onChange={props.handleOnChangeSettings}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput> */}
                </div>
              </>
            )}
            {props.MapURL && (
              <Button
                colorScheme="red"
                variant="outline"
                title="Delete"
                marginTop={'20px'}
                onClick={props.handleDeleteMap}
              >
                <Image
                  src={'/img/deleteicon.png'}
                  className="delete_icon"
                  alt="Delete"
                />
              </Button>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Flex>
    </>
  )
}
