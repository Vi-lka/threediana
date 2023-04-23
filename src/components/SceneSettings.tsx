import {
  Image,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tag,
  Select,
  Divider,
  Switch,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tooltip,
  Button,
} from '@chakra-ui/react'
import { BlendMode } from 'lamina/types'
import React, { useEffect, useState } from 'react'
import { HexColorInput } from 'react-colorful'
import useDebouncy from 'use-debouncy/lib/effect'
import DebouncedPicker from './DebouncedPicker'

export type SceneSettingsProps = {
  modelRotationState: boolean
  setModelRotationState: React.Dispatch<React.SetStateAction<boolean>>

  modelRotation: any
  setModelRotation: React.Dispatch<any>

  envColorState: boolean
  envMapState: boolean

  setEnvColorState: React.Dispatch<React.SetStateAction<boolean>>
  setEnvMapState: React.Dispatch<React.SetStateAction<boolean>>

  envColorBG: boolean
  envMapBG: boolean

  setEnvColorBG: React.Dispatch<React.SetStateAction<boolean>>
  setEnvMapBG: React.Dispatch<React.SetStateAction<boolean>>

  envMapBlur: number
  envMapFile: string

  setEnvMapBlur: React.Dispatch<React.SetStateAction<number>>
  setEnvMapFile: React.Dispatch<React.SetStateAction<string>>

  bgColor: string | undefined
  envColor: string | undefined
  envDepthColorA: string | undefined
  envDepthColorB: string | undefined

  setbgColor: React.Dispatch<React.SetStateAction<string | undefined>>
  setEnvColor: React.Dispatch<React.SetStateAction<string | undefined>>
  setEnvDepthColorA: React.Dispatch<React.SetStateAction<string | undefined>>
  setEnvDepthColorB: React.Dispatch<React.SetStateAction<string | undefined>>

  envColorAlpha: number
  envColorMode: string
  envDepthAlpha: number
  envDepthMode: string

  setEnvColorAlpha: React.Dispatch<React.SetStateAction<number>>
  setEnvColorMode: React.Dispatch<React.SetStateAction<BlendMode>>
  setEnvDepthAlpha: React.Dispatch<React.SetStateAction<number>>
  setEnvDepthMode: React.Dispatch<React.SetStateAction<BlendMode>>

  handleSaveRotation: () => void
  handleResetRotation: () => void
}

export default function SceneSettings(props: SceneSettingsProps) {
  const [tabIndex, setTabIndex] = useState(
    props.envColorState ? 0 : props.envMapState ? 1 : 0,
  )
  const [bgState, setbgState] = useState(props.envColorBG || props.envMapBG)

  const [envMapBlur, setEnvMapBlur] = useState<number>(props.envMapBlur)
  const [envColorAlpha, setEnvColorAlpha] = useState<number>(
    props.envColorAlpha,
  )
  const [envDepthAlpha, setEnvDepthAlpha] = useState<number>(
    props.envDepthAlpha,
  )

  useDebouncy(() => props.setEnvMapBlur(envMapBlur), 100, [envMapBlur])
  useDebouncy(() => props.setEnvColorAlpha(envColorAlpha), 100, [envColorAlpha])
  useDebouncy(() => props.setEnvDepthAlpha(envDepthAlpha), 100, [envDepthAlpha])

  const [thumb, setThumb] = useState<string>('')
  const thumbs = [
    '/textures/hdr/clarens_midday_thumb.png',
    '/textures/hdr/clarens_night_02_thumb.png',
    '/textures/hdr/cyclorama_hard_light_thumb.png',
    '/textures/hdr/fouriesburg_mountain_lookout_thumb.png',
    '/textures/hdr/kloppenheim_06_puresky_thumb.png',
    '/textures/hdr/studio_small_08_thumb.png',
  ]

  const hdrs = [
    '/textures/hdr/clarens_midday_2k.hdr',
    '/textures/hdr/clarens_night_02_2k.hdr',
    '/textures/hdr/cyclorama_hard_light_2k.hdr',
    '/textures/hdr/fouriesburg_mountain_lookout_2k.hdr',
    '/textures/hdr/kloppenheim_06_puresky_2k.hdr',
    '/textures/hdr/studio_small_08_2k.hdr',
  ]

  useEffect(() => {
    hdrs.forEach(function (element: string, index: number) {
      if (element === props.envMapFile) {
        setThumb(thumbs[index])
      }
    })
  })

  const handleFileName = (name: string) => {
    const fileName =
      name.slice(14, -10).replaceAll('_', ' ').charAt(0).toUpperCase() +
      name.slice(15, -10).replaceAll('_', ' ')

    return fileName
  }

  function EnvironmentFilesMap() {
    return (
      <>
        {thumbs.map((data: string, i: number) => (
          <Tooltip key={i} label={handleFileName(data)} closeOnClick={false}>
            <Image
              loading="lazy"
              w="100%"
              h="auto"
              m="5px auto"
              cursor="pointer"
              transition="0.1s ease-in-out"
              p={'0 15px'}
              backgroundColor={data === thumb ? 'blue.300' : 'inherit'}
              _hover={{ backgroundColor: 'blue.300' }}
              _focus={{ backgroundColor: 'blue.300' }}
              src={data}
              alt={handleFileName(data)}
              onClick={() => {
                props.setEnvMapFile(hdrs[i])
              }}
            />
          </Tooltip>
        ))}
      </>
    )
  }

  return (
    <>
      <Box
        id="SceneSettings"
        className="editForm3DSettings"
        maxH="80vh"
        h="80vh"
        paddingRight="0.5rem"
        overflowY="scroll"
      >
        <Accordion
          allowToggle
          onChange={index => {
            if (index === 0) {
              props.setModelRotationState(true)
            } else {
              props.setModelRotationState(false)
            }
          }}
        >
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
                <b>Model</b>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="row"
                wrap="wrap"
                justifyContent="center"
                alignItems="center"
                mt={3}
                mb={5}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={2}
                fontSize={14}
              >
                <Badge>Model Rotation:</Badge>
                <Flex
                  direction="column"
                  alignItems="center"
                  flex="1"
                  textAlign="center"
                  fontSize="14px"
                >
                  <Text>
                    X:{' '}
                    {props.modelRotation.x
                      ? props.modelRotation.x.toFixed(2)
                      : 0}
                  </Text>
                  <Text>
                    Y:{' '}
                    {props.modelRotation.y
                      ? props.modelRotation.y.toFixed(2)
                      : 0}
                  </Text>
                  <Text>
                    Z:{' '}
                    {props.modelRotation.z
                      ? props.modelRotation.z.toFixed(2)
                      : 0}
                  </Text>
                </Flex>
                <Flex direction="column" alignItems="center" textAlign="center">
                  <Button
                    fontSize="14px"
                    p={2}
                    h={'fit-content'}
                    mb={2}
                    colorScheme="green"
                    onClick={props.handleSaveRotation}
                  >
                    Save
                  </Button>
                  <Button
                    fontSize="11px"
                    p={2}
                    h={'fit-content'}
                    colorScheme="red"
                    onClick={props.handleResetRotation}
                  >
                    Reset
                  </Button>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            width="100%"
            isDisabled={props.envColorBG || props.envMapBG}
          >
            <AccordionButton
              flexWrap="wrap"
              pt={4}
              pb={4}
              border="1px solid rgba(32, 32, 32, 0.2)"
              borderRadius={8}
              _expanded={{ bg: 'blue.500', color: 'white', borderRadius: '0' }}
            >
              <Box flex="1" textAlign="left" mr={0.5}>
                <b>Background Color</b>
              </Box>
              <Box
                w="35px"
                h="35px"
                minW="35px"
                minH="35px"
                margin="0 4px"
                border="1px solid rgba(32, 32, 32, 0.2)"
                boxShadow="0px 0px 6px 0px rgba(34, 60, 80, 0.2)"
                bg={props.bgColor}
              />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3}>
              <Box w="100%" className="hexColorInput">
                <DebouncedPicker
                  color={props.bgColor}
                  onChange={color => props.setbgColor(color)}
                  wait={100}
                />
                <HexColorInput
                  color={props.bgColor}
                  onChange={props.setbgColor}
                  prefixed
                />
              </Box>
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
                <b>Environment</b>
              </Box>
              <Flex direction="row" justify="flex-end">
                {props.envColorState && (
                  <>
                    <Flex direction="column">
                      <Tag marginBottom={2}>Color</Tag>
                      <Tag>Depth</Tag>
                    </Flex>
                    <Flex direction="column">
                      <Box
                        w="25px"
                        h="25px"
                        minW="25px"
                        minH="25px"
                        margin="0 4px"
                        border="1px solid rgba(32, 32, 32, 0.2)"
                        boxShadow="0px 0px 4px 0px rgba(34, 60, 80, 0.2)"
                        bg={props.envColor}
                        marginBottom={2}
                      />
                      <Box
                        w="40px"
                        h="25px"
                        minW="40px"
                        minH="25px"
                        margin="0 4px"
                        border="1px solid rgba(32, 32, 32, 0.2)"
                        boxShadow="0px 0px 4px 0px rgba(34, 60, 80, 0.2)"
                        bgGradient={`linear(to-r, ${props.envDepthColorA}, ${props.envDepthColorB})`}
                      />
                    </Flex>
                  </>
                )}
                {props.envMapState && (
                  <>
                    <Flex direction="row" alignItems="center">
                      <Tag h="fit-content">HDR</Tag>
                      <Tooltip
                        label={handleFileName(thumb)}
                        closeOnClick={false}
                      >
                        <Image
                          loading="lazy"
                          w="58px"
                          h="58px"
                          m="0 4px"
                          boxShadow="0px 0px 6px 1px rgba(34, 60, 80, 0.2)"
                          border="1px solid rgba(32, 32, 32, 0.2)"
                          src={thumb}
                          title={handleFileName(thumb)}
                          alt={handleFileName(thumb)}
                        />
                      </Tooltip>
                    </Flex>
                  </>
                )}
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt={3} pb={3} pl={3} pr={3}>
              <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt={3}
                mb={5}
                border="1px solid rgba(32, 32, 32, 0.2)"
                borderRadius={10}
                p={3}
                fontSize={14}
              >
                <Switch
                  id="idEnvColorState"
                  size="lg"
                  colorScheme="green"
                  mr={2}
                  isChecked={props.envColorState || props.envMapState}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    props.setEnvColorState(e.target.checked)
                    props.setEnvMapState(false)
                    if (e.target.checked === false) {
                      setbgState(false)
                      setTabIndex(0)
                      props.setEnvColorBG(false)
                      props.setEnvMapBG(false)
                    }
                  }}
                />
                <label htmlFor="idEnvColorState">
                  {props.envColorState || props.envMapState ? 'ON' : 'OFF'}
                </label>
              </Flex>

              {(props.envColorState || props.envMapState) && (
                <Box>
                  <Flex
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                    mb={3}
                    border="1px solid rgba(32, 32, 32, 0.2)"
                    borderRadius={10}
                    p={3}
                  >
                    <Badge mr={3}>Background:</Badge>
                    <Box fontSize={12}>
                      <Switch
                        id="idEnvColorBG"
                        size="md"
                        colorScheme="green"
                        mr={1}
                        isChecked={props.envColorBG || props.envMapBG}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setbgState(e.target.checked)
                          if (tabIndex === 0) {
                            props.setEnvColorBG(e.target.checked)
                            props.setEnvMapBG(false)
                          } else if (tabIndex === 1) {
                            props.setEnvMapBG(e.target.checked)
                            props.setEnvColorBG(false)
                          }
                        }}
                      />
                      <label htmlFor="idEnvColorBG">
                        {bgState ? 'ON' : 'OFF'}
                      </label>
                    </Box>
                  </Flex>
                  <Tabs
                    isManual
                    isFitted
                    variant="line"
                    defaultIndex={tabIndex}
                    onChange={index => {
                      setTabIndex(index)
                      if (index === 0) {
                        props.setEnvColorState(true)
                        props.setEnvMapState(false)
                        if (bgState === true) {
                          props.setEnvColorBG(true)
                          props.setEnvMapBG(false)
                        }
                      } else if (index === 1) {
                        props.setEnvMapState(true)
                        props.setEnvColorState(false)
                        if (bgState === true) {
                          props.setEnvMapBG(true)
                          props.setEnvColorBG(false)
                        }
                      }
                    }}
                  >
                    <TabList>
                      <Tab>Color</Tab>
                      <Tab>HDR</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel pt={3} pb={3} pl={1} pr={1}>
                        <Accordion allowToggle>
                          <Heading
                            as="h5"
                            size="sm"
                            mb={2}
                            textAlign="center"
                            mt="20px"
                          >
                            Color:
                          </Heading>
                          <Flex
                            direction="column"
                            alignItems="flex-end"
                            mb="20px"
                            border="1px solid rgba(32, 32, 32, 0.2)"
                            borderRadius={10}
                            p={3}
                          >
                            <Badge>Color Alpha:</Badge>
                            <Slider
                              min={0}
                              max={1}
                              step={0.01}
                              flex="1"
                              mb="14px"
                              mr="6px"
                              width="calc(100% - 12px)"
                              focusThumbOnChange={false}
                              value={envColorAlpha}
                              onChange={setEnvColorAlpha}
                              //   onChangeEnd={props.handleChangeEnvColorAlpha}
                              isDisabled={!props.envColorState}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb fontSize="xs" boxSize="28px">
                                {envColorAlpha}
                              </SliderThumb>
                            </Slider>
                            <Badge>Color Mode:</Badge>
                            <Select
                              variant="filled"
                              placeholder="None"
                              size="xs"
                              mb="14px"
                              value={props.envColorMode}
                              onChange={e =>
                                props.setEnvColorMode(
                                  e.target.value as BlendMode,
                                )
                              }
                              isDisabled={!props.envColorState}
                            >
                              <option value="normal">Normal</option>
                              <option value="add">Add</option>
                              <option value="subtract">Subtract</option>
                              <option value="multiply">Multiply</option>
                              <option value="lighten">Lighten</option>
                              <option value="darken">Darken</option>
                              <option value="divide">Divide</option>
                              <option value="overlay">Overlay</option>
                              <option value="screen">Screen</option>
                              <option value="softlight">Softlight</option>
                              <option value="reflect">Reflect</option>
                              <option value="negation">Negation</option>
                            </Select>

                            <Badge>Color</Badge>
                            <AccordionItem
                              width="100%"
                              border="none"
                              isDisabled={!props.envColorState}
                            >
                              <AccordionButton
                                pt={2}
                                pb={2}
                                bg="gray.100"
                                _expanded={{ bg: 'blue.300', color: 'white' }}
                              >
                                <Flex
                                  alignItems="center"
                                  flex="1"
                                  textAlign="left"
                                  fontSize="14px"
                                >
                                  {/* <Tag height='fit-content'>Color</Tag> */}
                                  <Box
                                    className="fileInputImgmap"
                                    w="25px"
                                    h="25px"
                                    minW="25px"
                                    minH="25px"
                                    boxShadow="0px 0px 4px 0px rgba(34, 60, 80, 0.2)"
                                    bg={props.envColor}
                                  />
                                </Flex>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pt={3} pb={3}>
                                <Flex
                                  w="100%"
                                  direction="column"
                                  className="hexColorInput"
                                >
                                  <DebouncedPicker
                                    color={props.envColor}
                                    onChange={props.setEnvColor}
                                    wait={100}
                                  />
                                  <HexColorInput
                                    color={props.envColor}
                                    onChange={props.setEnvColor}
                                    prefixed
                                  />
                                </Flex>
                              </AccordionPanel>
                            </AccordionItem>
                          </Flex>

                          <Divider />
                          <Divider />

                          <Heading
                            as="h5"
                            size="sm"
                            mb={2}
                            textAlign="center"
                            mt="20px"
                          >
                            Depth:
                          </Heading>
                          <Flex
                            direction="column"
                            alignItems="flex-end"
                            mb={3}
                            border="1px solid rgba(32, 32, 32, 0.2)"
                            borderRadius={10}
                            p={3}
                          >
                            <Badge>Depth Alpha:</Badge>
                            <Slider
                              min={0}
                              max={1}
                              step={0.01}
                              flex="1"
                              mb="14px"
                              mr="6px"
                              width="calc(100% - 12px)"
                              focusThumbOnChange={false}
                              value={envDepthAlpha}
                              onChange={setEnvDepthAlpha}
                              //   onChangeEnd={props.setEnvDepthAlpha}
                              isDisabled={!props.envColorState}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb fontSize="xs" boxSize="28px">
                                {envDepthAlpha}
                              </SliderThumb>
                            </Slider>

                            <Badge>Depth Mode:</Badge>
                            <Select
                              variant="filled"
                              placeholder="None"
                              size="xs"
                              mb="14px"
                              value={props.envDepthMode}
                              onChange={e =>
                                props.setEnvDepthMode(
                                  e.target.value as BlendMode,
                                )
                              }
                              isDisabled={!props.envColorState}
                            >
                              <option value="normal">Normal</option>
                              <option value="add">Add</option>
                              <option value="subtract">Subtract</option>
                              <option value="multiply">Multiply</option>
                              <option value="lighten">Lighten</option>
                              <option value="darken">Darken</option>
                              <option value="divide">Divide</option>
                              <option value="overlay">Overlay</option>
                              <option value="screen">Screen</option>
                              <option value="softlight">Softlight</option>
                              <option value="reflect">Reflect</option>
                              <option value="negation">Negation</option>
                            </Select>

                            <Badge>Depth Color A</Badge>
                            <AccordionItem
                              width="100%"
                              mb={3}
                              isDisabled={!props.envColorState}
                            >
                              <AccordionButton
                                pt={2}
                                pb={2}
                                bg="gray.200"
                                _expanded={{ bg: 'blue.300', color: 'white' }}
                              >
                                <Flex
                                  alignItems="center"
                                  flex="1"
                                  textAlign="left"
                                  fontSize="14px"
                                >
                                  {/* <Tag height='fit-content'>Depth A</Tag> */}
                                  <Box
                                    className="fileInputImgmap"
                                    w="20px"
                                    h="20px"
                                    minW="20px"
                                    minH="20px"
                                    boxShadow="0px 0px 4px 0px rgba(34, 60, 80, 0.2)"
                                    bg={props.envDepthColorA}
                                  />
                                </Flex>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pt={3} pb={3}>
                                <Flex
                                  w="100%"
                                  direction="column"
                                  className="hexColorInput"
                                >
                                  <DebouncedPicker
                                    color={props.envDepthColorA}
                                    onChange={props.setEnvDepthColorA}
                                    wait={100}
                                  />
                                  <HexColorInput
                                    color={props.envDepthColorA}
                                    onChange={props.setEnvDepthColorA}
                                    prefixed
                                  />
                                </Flex>
                              </AccordionPanel>
                            </AccordionItem>

                            <Badge>Depth Color B</Badge>
                            <AccordionItem
                              width="100%"
                              isDisabled={!props.envColorState}
                            >
                              <AccordionButton
                                pt={2}
                                pb={2}
                                bg="gray.200"
                                _expanded={{ bg: 'blue.300', color: 'white' }}
                              >
                                <Flex
                                  alignItems="center"
                                  flex="1"
                                  textAlign="left"
                                  fontSize="14px"
                                >
                                  {/* <Tag height='fit-content'>Depth B</Tag> */}
                                  <Box
                                    className="fileInputImgmap"
                                    w="20px"
                                    h="20px"
                                    minW="20px"
                                    minH="20px"
                                    boxShadow="0px 0px 4px 0px rgba(34, 60, 80, 0.2)"
                                    bg={props.envDepthColorB}
                                  />
                                </Flex>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pt={3} pb={3}>
                                <Flex
                                  w="100%"
                                  direction="column"
                                  className="hexColorInput"
                                >
                                  <DebouncedPicker
                                    color={props.envDepthColorB}
                                    onChange={props.setEnvDepthColorB}
                                    wait={100}
                                  />
                                  <HexColorInput
                                    color={props.envDepthColorB}
                                    onChange={props.setEnvDepthColorB}
                                    prefixed
                                  />
                                </Flex>
                              </AccordionPanel>
                            </AccordionItem>
                          </Flex>
                        </Accordion>
                      </TabPanel>
                      <TabPanel pt={3} pb={3} pl={1} pr={1}>
                        <Accordion allowToggle>
                          <Flex
                            direction="column"
                            alignItems="flex-end"
                            mb={3}
                            mt="20px"
                            border="1px solid rgba(32, 32, 32, 0.2)"
                            borderRadius={10}
                            p={3}
                          >
                            <Badge>Blur:</Badge>
                            <Slider
                              min={0}
                              max={1}
                              step={0.01}
                              flex="1"
                              mb="14px"
                              mr="6px"
                              width="calc(100% - 12px)"
                              focusThumbOnChange={false}
                              value={envMapBlur}
                              onChange={setEnvMapBlur}
                              //   onChangeEnd={props.setEnvMapBlur}
                              isDisabled={!props.envMapState}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb fontSize="xs" boxSize="28px">
                                {envMapBlur}
                              </SliderThumb>
                            </Slider>
                          </Flex>
                          <Flex
                            direction="column"
                            alignItems="flex-end"
                            mb={3}
                            border="1px solid rgba(32, 32, 32, 0.2)"
                            borderRadius={10}
                            p={3}
                          >
                            <Badge>File:</Badge>
                            <AccordionItem
                              width="100%"
                              isDisabled={!props.envMapState}
                            >
                              <AccordionButton
                                pt={2}
                                pb={2}
                                bg="gray.200"
                                _expanded={{ bg: 'blue.300', color: 'white' }}
                              >
                                <Flex
                                  alignItems="center"
                                  flex="1"
                                  textAlign="center"
                                  fontSize="14px"
                                >
                                  <Text w="100%">{handleFileName(thumb)}</Text>
                                </Flex>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pt={3} pb={3}>
                                <Box w="fit-content">
                                  <EnvironmentFilesMap />
                                </Box>
                              </AccordionPanel>
                              <Box bg="gray.200">
                                <Tooltip
                                  label={handleFileName(thumb)}
                                  closeOnClick={false}
                                >
                                  <Image
                                    loading="lazy"
                                    w="100%"
                                    h="auto"
                                    m="0 auto"
                                    p="2%"
                                    src={thumb}
                                    title={handleFileName(thumb)}
                                    alt={handleFileName(thumb)}
                                  />
                                </Tooltip>
                              </Box>
                            </AccordionItem>
                          </Flex>
                        </Accordion>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  )
}
