import React, { Suspense, createRef, useEffect, useState } from 'react'
import { TbBoxModel } from 'react-icons/tb'
import { BsImages } from 'react-icons/bs'
import { IoInformationCircle } from 'react-icons/io5'
import { FaMagic, FaRegLightbulb } from 'react-icons/fa'
import * as THREE from 'three'
import {
    Canvas,
    ObjectMap,
    useFrame,
    useLoader,
    useThree,
} from '@react-three/fiber'
import {
    Center as DreiCenter,
    Environment,
    Bounds,
    Html,
    Loader,
    Preload,
    useGLTF,
    useProgress,
    OrbitControls,
    TransformControls,
    ContactShadows,
    useHelper,
} from '@react-three/drei'
import { BlendMode } from 'lamina/types'
import { BlendFunction } from 'postprocessing'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Badge, Box, Button, Container, Flex, Icon, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, useToast, Image, Textarea, Input } from '@chakra-ui/react'
import { Color, Depth, LayerMaterial } from 'lamina'
import AnnotationsMap from './AnnotationsMap'
import DirectLighting from './DirectLighting'
import PointLighting from './PointLighting'
import SpotLighting from './SpotLighting'
import Postprocessing from './Postprocessing'
import ThreeHud from './ThreeHud'
import TexturesSettings from './TexturesSettings'
import DirectLightingSettings from './DirectLightingSettings'
import PointLightingSettings from './PointLightingSettings'
import SpotLightingSettings from './SpotLightingSettings'
import SceneSettings from './SceneSettings'
import PostprocessingSettings from './PostprocessingSettings'

export default function CanvasMain() {
    const [tabIndex, setTabIndex] = useState(0)

    const maxCounter = 10

    // set Loading
    const { active } = useProgress()
    const [loadingState, setloadingState] = useState<boolean>(true)
    useEffect(() => {
        setloadingState(active)
    }, [active])

    // set 3D-Model
    const [model, setModel] = useState<(GLTF & ObjectMap) | null>(null)
    // const [modelURL, setModelURL] = useState('')

    // set Maps for 3D-Model
    const [selectedMaterial, setSelectedMaterial] = useState<string>('')

    const [colors, setColors] = useState<
        Array<{
            material: string | undefined
            color: string | undefined
        }>
    >([])

    useEffect(() => {
        if (model) {
            setSelectedMaterial(Object.keys(model.materials)[0])

            const colorsArray = []
            for (const mat in model.materials) {
                colorsArray.push({ material: mat, color: undefined })
            }
            setColors(colorsArray)
        }
    }, [model])

    // Need Maps from database
    const [colorMapsURLs, setcolorMapsURLs] = useState<
        Array<{ material: string | undefined; url: string | null }>
    >([])

    const [normalMapsURLs, setnormalMapsURLs] = useState<
        Array<{ material: string | undefined; url: string | null }>
    >([])

    // const [metalnessMap, setmetalnessMap] = useState<any | null>(null)
    // const [metalnessMapURL, setmetalnessMapURL] = useState('')
    // const [metalness, setMetalness] = useState('0')

    // const [roughnessMap, setroughnessMap] = useState<any | null>(null)
    // const [roughnessMapURL, setroughnessMapURL] = useState('')
    // const [roughness, setRoughness] = useState('1')

    // const [aoMap, setaoMap] = useState<any | null>(null)
    // const [aoMapURL, setaoMapURL] = useState('')
    // const [aoIntensity, setaoIntensity] = useState('1')

    // set Screenshot
    // const [screenshot, setScreenshot] = useState<any | null>(null)

    // set Modes
    const [annotationMode, setAnnotationMode] = useState<boolean>(false)
    const [measuringMode, setMeasuringMode] = useState<boolean>(false)
    const [lightingMode, setLightingMode] = useState<boolean>(false)

    // Measuring counter
    const [counterMeasuring, setCounterMeasuring] = useState<number>(0)

    // Annotations states
    const [counter, setCounter] = useState<number>(0)

    const [annotations, setAnnotations] = useState<
        Array<{ position?: THREE.Vector3; title?: string; info?: string }>
    >([])
    const annotationsSettingsRefs = annotations.map(() =>
        createRef<HTMLDivElement>(),
    )

    const [selectedAnnotation, setSelectedAnnotation] = useState<number>(
        counter - 1,
    )

    // Annotations handles
    const handleDeleteAnnotation = (i: number) => {
        setCounter(counter - 1)

        const filteredAnnotations = annotations.filter(
            item => item !== annotations[i],
        )
        setAnnotations(filteredAnnotations)
    }

    const handleChangeTitle = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const changedAnnotations = annotations.map((data, i) => {
            if (i === index) {
                return {
                    ...data,
                    title: e.target.value,
                }
            }
            return data
        })
        setAnnotations(changedAnnotations)
    }

    const handleChangeInfo = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number,
    ) => {
        const changedAnnotations = annotations.map((data, i) => {
            if (i === index) {
                return {
                    ...data,
                    info: e.target.value,
                }
            }
            return data
        })
        setAnnotations(changedAnnotations)
    }

    // Lighting states
    const [counterDirectLight, setCounterDirectLight] = useState<number>(0)
    const [directLighting, setDirectLighting] = useState<
        Array<{
            position?: THREE.Vector3
            rotation?: THREE.Euler
            intensity?: number
            color?: string
        }>
    >([])
    const [selectedDirectLight, setSelectedDirectLight] =
        useState<number>(counterDirectLight)

    const [counterPointLight, setCounterPointLight] = useState<number>(0)
    const [pointLighting, setPointLighting] = useState<
        Array<{
            position?: THREE.Vector3
            intensity?: number
            color?: string
            distance?: number
        }>
    >([])
    const [selectedPointLight, setSelectedPointLight] =
        useState<number>(counterPointLight)

    const [counterSpotLight, setCounterSpotLight] = useState<number>(0)
    const [spotLighting, setSpotLighting] = useState<
        Array<{
            position?: THREE.Vector3
            intensity?: number
            color?: string
            distance?: number
            angle?: number
        }>
    >([])
    const [selectedSpotLight, setSelectedSpotLight] =
        useState<number>(counterSpotLight)

    // Lighting handles
    const handlePlaceDirectLight = () => {
        if (counterDirectLight < maxCounter) {
            setCounterDirectLight(counterDirectLight + 1)
            setDirectLighting([
                ...directLighting,
                {
                    position: new THREE.Vector3(
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                    ),
                    rotation: new THREE.Euler(0, 0, 0),
                    intensity: 1,
                    color: '#ffffff',
                },
            ])
            setSelectedDirectLight(counterDirectLight)
        }
    }
    const handleDeleteDirectLight = (i: number) => {
        setCounterDirectLight(counterDirectLight - 1)

        const filteredDirectLighting = directLighting.filter(
            item => item !== directLighting[i],
        )
        setDirectLighting(filteredDirectLighting)
    }

    const handlePlacePointLight = () => {
        if (counterPointLight < maxCounter) {
            setCounterPointLight(counterPointLight + 1)
            setPointLighting([
                ...pointLighting,
                {
                    position: new THREE.Vector3(
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                    ),
                    intensity: 1,
                    color: '#ffffff',
                    distance: 5,
                },
            ])
            setSelectedPointLight(counterPointLight)
        }
    }
    const handleDeletePointLight = (i: number) => {
        setCounterPointLight(counterPointLight - 1)

        const filteredPointLighting = pointLighting.filter(
            item => item !== pointLighting[i],
        )
        setPointLighting(filteredPointLighting)
    }

    const handlePlaceSpotLight = () => {
        if (counterSpotLight < maxCounter) {
            setCounterSpotLight(counterSpotLight + 1)
            setSpotLighting([
                ...spotLighting,
                {
                    position: new THREE.Vector3(
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                        6 * Math.random() - 3,
                    ),
                    intensity: 1,
                    color: '#ffffff',
                    distance: 5,
                    angle: 0.3,
                },
            ])
            setSelectedSpotLight(counterSpotLight)
        }
    }
    const handleDeleteSpotLight = (i: number) => {
        setCounterSpotLight(counterSpotLight - 1)

        const filteredSpotLighting = spotLighting.filter(
            item => item !== spotLighting[i],
        )
        setSpotLighting(filteredSpotLighting)
    }

    // Scene Settings
    const [envColorState, setEnvColorState] = useState<boolean>(true)
    const [envMapState, setEnvMapState] = useState<boolean>(false)

    const [envColorBG, setEnvColorBG] = useState<boolean>(false)
    const [envMapBG, setEnvMapBG] = useState<boolean>(false)

    const [envMapBlur, setEnvMapBlur] = useState<number>(0)
    const [envMapFile, setEnvMapFile] = useState<string>(
        '/textures/hdr/clarens_midday_2k.hdr',
    )

    const [bgColor, setbgColor] = useState<string | undefined>('#EEEEEE')
    const [envColor, setEnvColor] = useState<string | undefined>('#EEEEEE')
    const [envDepthColorA, setEnvDepthColorA] = useState<string | undefined>(
        '#EEEEEE',
    )
    const [envDepthColorB, setEnvDepthColorB] = useState<string | undefined>(
        '#EEEEEE',
    )

    const [envColorAlpha, setEnvColorAlpha] = useState<number>(0.4)
    const [envColorMode, setEnvColorMode] = useState<BlendMode>('normal')

    const [envDepthAlpha, setEnvDepthAlpha] = useState<number>(0.5)
    const [envDepthMode, setEnvDepthMode] = useState<BlendMode>('normal')

    const [modelRotationState, setModelRotationState] = useState<boolean>(false)
    const [modelRotation, setModelRotation] = useState<any>([0, 0, 0])

    const gltfRef = createRef<any>()

    const rotateReset = new THREE.Euler(0, 0, 0)
    let modelRotate = modelRotation

    // Scene handles
    const handleSaveRotation = () => setModelRotation(modelRotate)

    const handleResetRotation = () => setModelRotation(rotateReset)

    useEffect(() => {
        if (tabIndex !== 3) {
            setModelRotationState(false)
        }
    }, [tabIndex])

    // Postprocessing Settings
    const [bloom, setBloom] = useState({
        enabled: false,
        intensity: 1, //Range is [0, 10]
        luminanceThreshold: 0.05, //Range is [0, 1]
        luminanceSmoothing: 0.5, //Range is [0, 1]
    })
    const [brightnessContrast, setBrightnessContrast] = useState({
        enabled: false,
        opacity: 1, //Range is [0, 1]
        brightness: 0.1, //Range is [-1, 1]
        contrast: 0.2, //Range is [-1, 1]
    })
    const [chromaticAberration, setChromaticAberration] = useState({
        enabled: false,
        offset: new THREE.Vector2(0.005, 0.005),
    })
    const [depthOfField, setDepthOfField] = useState({
        enabled: false,
        focusDistance: 0, //Range is [0, 1]
        focalLength: 0.2, //Range is [0, 1]
        bokehScale: 3, //Range is [0, 10]
    })
    const [ssao, setSSAO] = useState({
        enabled: false,
        blendFunction: BlendFunction.MULTIPLY, // Use ALPHA or NORMAL to see the effect // MULTIPLY SUBTRACT OVERLAY
        radius: 0.08, //Range [0.001, 1]
        bias: 0.015, //Range [0.001, 0.1]
        intensity: 1, //Range [0, 5]
    })
    const [toneMapping, setToneMapping] = useState({
        enabled: false,
        middleGrey: 0.6, //Range is [-1, 1]
        maxLuminance: 16, //Range is [0, 20]
    })
    const [vignette, setVignette] = useState({
        enabled: false,
        offset: 0.5, //Range is [-1, 1]
        darkness: 0.5, //Range is [0, 1]
    })

    // Global handles
    const handleSaveChanges = () => {
        console.log('Save...')
    }

    // Main Model Scene
    function Scene() {
        const stateThree = useThree()

        const regress = useThree(state => state.performance.regress)
        useEffect(() => {
            if (!measuringMode) {
                stateThree.controls?.addEventListener('change', regress)
            } else {
                stateThree.controls?.removeEventListener('change', regress)
            }
        })

        function AdaptivePixelRatio() {
            const current = useThree(state => state.performance.current)
            useEffect(() => {
                stateThree.gl.setPixelRatio(0.9 * (window.devicePixelRatio * current))
            })
            return null
        }

        const toast = useToast()
        const idToastAnnotations = 'toast-annotations'
        // const idToastMeasuring = 'toast-measuring'

        // Model Settings
        // const gltf = useGLTF(file.data ? file.data : '', true, true) as GLTF &
        //     ObjectMap

        // useEffect(() => {
        //     setModel(gltf)
        // }, [file.data])
        const gltf = useGLTF('/models/Arrow.glb', true, true) as GLTF &
            ObjectMap

        useEffect(() => {
            setModel(gltf)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        function getMapsUrls(
            maps: Array<{ material?: string; url: string | null }>,
        ) {
            const urls: string[] = []
            maps.forEach(item => {
                item.url && urls.push(item.url)
            })

            return urls
        }

        const colorMapsTextures = useLoader(
            THREE.TextureLoader,
            getMapsUrls(colorMapsURLs),
        )

        const normalMapsTextures = useLoader(
            THREE.TextureLoader,
            getMapsUrls(normalMapsURLs),
        )

        useEffect(() => {
            for (const mat in gltf.materials) {
                const copyMaterial = gltf.materials[mat].clone() as THREE.MeshStandardMaterial

                for (const index in colors) {
                    if (colors[index] && (colors[index].material === mat)) {
                        const newColor = new THREE.Color(colors[index].color)
                        copyMaterial.color = newColor
                    }
                }

                for (const index in colorMapsURLs) {
                    if (colorMapsURLs[index].material === mat) {
                        copyMaterial.map = colorMapsTextures[index]
                    }
                }

                for (const index in normalMapsURLs) {
                    if (normalMapsURLs[index].material === mat) {
                        copyMaterial.normalMap = normalMapsTextures[index]
                    }
                }

                gltf.scene.traverse(function (object: THREE.Object3D<THREE.Event>) {
                    if (object instanceof THREE.Mesh) {
                        if (object.material.name === mat) {
                            object.material = copyMaterial
                        }

                        // color && (object.material.color = myMaterial.color)
                        // metalness && (object.material.metalness = myMaterial.metalness)
                        // roughness && (object.material.roughness = myMaterial.roughness)
                        // object.material.wireframe = true
                    }
                })
            }
        }, [colorMapsTextures, colors])

        const sceneBox = new THREE.Box3().setFromObject(gltf.scene)
        const sceneSize = sceneBox.getSize(new THREE.Vector3())

        // ReyCasting settings
        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()])

        const mouseHelper = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 10),
            new THREE.MeshNormalMaterial(),
        )
        mouseHelper.visible = false
        stateThree.scene.add(mouseHelper)

        const intersects:
            | THREE.Intersection<THREE.Object3D<THREE.Event>>[]
            | undefined = []

        const intersection = {
            intersects: true,
            point: new THREE.Vector3(),
            normal: new THREE.Vector3(),
        }

        let n = new THREE.Vector3()

        let moved = false

        window.addEventListener('wheel', function () {
            moved = true
        })

        // Annotations
        const [textHovered, setTextHovered] = useState(false)

        // Handle Place Annotation
        stateThree.gl.domElement.addEventListener('dblclick', function () {
            if (
                annotationMode &&
                moved === false &&
                intersection.intersects &&
                textHovered === false
            ) {
                handlePlaceAnnotation()
            }
        })

        const handlePlaceAnnotation = () => {
            if (counter < maxCounter) {
                setCounter(counter + 1)
                annotations[counter] = { position: n, title: '', info: '' }
                setSelectedAnnotation(counter)
                setAnnotations(annotations)
            }
        }

        const handleTextHovered = (value: boolean) => {
            setTextHovered(value)
        }

        const handleSelectAnnotation = (value: number) => {
            setSelectedAnnotation(value)
        }

        const handleImgAnnotationHoverEnter = (i: number) => {
            stateThree.gl.domElement.style.cursor = 'pointer'
            if (i !== selectedAnnotation) {
                annotationsSettingsRefs[i].current?.classList.add(
                    'annotationsSettingsHover',
                )
            }
        }

        const handleImgAnnotationHoverLeave = (i: number) => {
            stateThree.gl.domElement.style.cursor = 'auto'
            annotationsSettingsRefs[i].current?.classList.remove(
                'annotationsSettingsHover',
            )
        }

        annotationsSettingsRefs.forEach(function (
            element: React.RefObject<HTMLDivElement>,
            index: number,
        ) {
            if (index === selectedAnnotation) {
                element.current?.classList.add('selected')
                element.current?.classList.remove('annotationsSettingsHover')
            } else {
                element.current?.classList.remove('selected')
            }
        })

        useEffect(() => {
            stateThree.gl.domElement.addEventListener('dblclick', function () {
                if (
                    annotationMode &&
                    moved === false &&
                    intersection.intersects &&
                    textHovered === false &&
                    counter === maxCounter &&
                    !toast.isActive(idToastAnnotations)
                ) {
                    toast({
                        id: idToastAnnotations,
                        title: 'Внимание!',
                        description: `Можно добавлять не более ${maxCounter} аннотаций`,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                    })
                }
            })
        }, [
            intersection.intersects,
            moved,
            stateThree.gl.domElement,
            textHovered,
            toast,
        ])

        // Measuring
        const labelRenderer = new CSS2DRenderer()
        labelRenderer.domElement.id = 'labelDiv'
        labelRenderer.setSize(stateThree.size.width, stateThree.size.height)
        labelRenderer.domElement.style.position = 'absolute'
        labelRenderer.domElement.style.top = '0px'
        labelRenderer.domElement.style.right = '0px'
        labelRenderer.domElement.style.pointerEvents = 'none'
        const canvasFrame = document.getElementById('CanvasFrame')
        canvasFrame?.appendChild(labelRenderer.domElement)

        function onWindowResize() {
            labelRenderer.setSize(stateThree.size.width, stateThree.size.height)
        }
        window.addEventListener('resize', onWindowResize, false)

        const geometryBox = new THREE.BoxGeometry(
            sceneSize.x / 90,
            sceneSize.y / 90,
            sceneSize.z / 90,
        )
        const materialBox = new THREE.MeshBasicMaterial({
            color: 0xe01414,
            transparent: true,
            opacity: 0.5,
            depthTest: false,
        })
        const materialLine = new THREE.LineBasicMaterial({
            color: 0xe01414,
            transparent: false,
            depthTest: false,
        })

        let lineId = 0
        let lineMeasuring: THREE.Line
        let boxMeasuringStart: THREE.Mesh
        let boxMeasuringEnd: THREE.Mesh
        let drawingLine = false

        let measurementLabels: { [key: number]: CSS2DObject } = {}

        const handleMeasurement = () => {
            try {
                if (intersects.length > 0 && measuringMode && moved === false) {
                    if (!drawingLine) {
                        //start the line
                        stateThree.scene.add(boxMeasuringStart)
                        stateThree.scene.add(boxMeasuringEnd)
                        stateThree.scene.add(lineMeasuring)
                        stateThree.scene.add(measurementLabels[lineId])

                        drawingLine = true
                    } else {
                        //finish the line
                        lineId++
                        drawingLine = false
                    }
                }
            } catch (error) {
                // console.log(error)
            }
        }

        stateThree.gl.domElement.addEventListener('click', function () {
            if (intersects.length > 0 && measuringMode && moved === false) {
                handleMeasurement()
            }
        })

        const handleDeleteMeasurement = () => {
            lineId = 0
            measurementLabels = {}
            stateThree.scene.children.forEach(object => {
                if (
                    object.name === 'measurementLabel' ||
                    object.name === 'lineMeasuring' ||
                    object.name === 'boxMeasuring'
                ) {
                    stateThree.scene.remove(object)
                }
            })
        }

        useEffect(() => {
            stateThree.gl.domElement.style.cursor =
                measuringMode && moved === false ? 'crosshair' : 'auto'
        }, [stateThree.gl.domElement.style, moved])

        useFrame(state => {
            // Annotations useFrame
            if (
                annotationMode &&
                moved === false &&
                textHovered === false &&
                gltf.scene.children[0]
            ) {
                state.raycaster.intersectObject(
                    gltf.scene.children[0],
                    true,
                    intersects,
                )

                if (intersects && intersects.length > 0 && intersects[0].face) {
                    n = intersects[0].face.normal.clone()
                    n.transformDirection(intersects[0].object.matrixWorld)
                    n.multiplyScalar(
                        0.04 * ((sceneSize.x + sceneSize.y + sceneSize.z) / 3),
                    )
                    n.add(intersects[0].point)

                    intersection.intersects = true
                    intersects.length = 0
                } else {
                    intersection.intersects = false
                }
            } else if (intersects.length > 0) {
                intersects.length = 0
                intersection.intersects = false
            }

            // Measuring useFrame

            labelRenderer.render(stateThree.scene, stateThree.camera)

            if (measuringMode && gltf.scene.children[0]) {
                state.raycaster.intersectObject(
                    gltf.scene.children[0],
                    true,
                    intersects,
                )

                if (intersects && intersects.length > 0 && moved === false) {
                    if (!drawingLine) {
                        //start the line
                        const points: Array<THREE.Vector3> = []
                        points.push(intersects[0].point)
                        points.push(intersects[0].point.clone())
                        const geometryMeasuring = new THREE.BufferGeometry().setFromPoints(
                            points,
                        )
                        lineMeasuring = new THREE.LineSegments(
                            geometryMeasuring,
                            materialLine,
                        )
                        // lineMeasuring.frustumCulled = false

                        boxMeasuringStart = new THREE.Mesh(geometryBox, materialBox)
                        boxMeasuringEnd = new THREE.Mesh(geometryBox, materialBox)

                        const measurementDiv = document.createElement(
                            'div',
                        ) as HTMLDivElement
                        measurementDiv.className = 'measurementLabel'
                        measurementDiv.innerText = '0.0'
                        const measurementLabel = new CSS2DObject(measurementDiv)
                        measurementLabel.position.copy(intersects[0].point)
                        measurementLabels[lineId] = measurementLabel

                        lineMeasuring.name = 'lineMeasuring'
                        boxMeasuringStart.name = 'boxMeasuring'
                        boxMeasuringEnd.name = 'boxMeasuring'
                        measurementLabels[lineId].name = 'measurementLabel'
                    } else {
                        //finish the line
                        const positions = (
                            lineMeasuring.geometry.attributes.position as any
                        ).array as Array<number>
                        positions[3] = intersects[0].point.x
                        positions[4] = intersects[0].point.y
                        positions[5] = intersects[0].point.z
                        lineMeasuring.geometry.attributes.position.needsUpdate = true

                        const v0 = new THREE.Vector3(
                            positions[0],
                            positions[1],
                            positions[2],
                        )
                        const v1 = new THREE.Vector3(
                            intersects[0].point.x,
                            intersects[0].point.y,
                            intersects[0].point.z,
                        )

                        boxMeasuringStart.position.copy(v0)
                        boxMeasuringEnd.position.copy(v1)

                        const distance = v0.distanceTo(v1)
                        if (measurementLabels[lineId].element) {
                            measurementLabels[lineId].element.innerText = distance.toFixed(2)
                            measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5)
                        }
                    }
                } else {
                    intersection.intersects = false
                }
            } else {
                handleDeleteMeasurement()
                if (intersects && intersects.length > 0) {
                    intersects.length = 0
                    intersection.intersects = false
                }
            }
        })

        function ClippingPlane() {
            const { gl, scene } = useThree()
            const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.5)
            gl.clippingPlanes = [plane]
            gl.localClippingEnabled = true

            const planeHelper = new THREE.PlaneHelper(plane, 2, 0x000000)
            scene.add(planeHelper)

            return null
        }

        return (
            <>
                <Bounds
                    fit={loadingState}
                    clip={loadingState}
                    observe
                    damping={0}
                    margin={1.2}
                >
                    <DreiCenter ref={gltfRef} rotation={modelRotation}>
                        <primitive
                            object={gltf.scene}
                            position={[0, 0, 0]}
                            rotation={[0, 0, 0]}
                            scale={1}
                            receiveShadow
                            castShadow
                        />
                        {/* <ClippingPlane /> */}
                    </DreiCenter>
                </Bounds>

                <ContactShadows
                    frames={1}
                    position={[0, -(sceneSize.y / 2), 0]}
                    blur={2}
                    far={10}
                    opacity={lightingMode ? 0 : 0.8}
                />

                <AnnotationsMap
                    range={counter}
                    annotationIcon={'/img/infoicon.png'}
                    annotationsData={annotations}
                    scale={(sceneSize.x + sceneSize.y + sceneSize.z) / 3 / 30}
                    sceneSize={sceneSize}
                    textHoverEnter={e => {
                        e.stopPropagation()
                        handleTextHovered(true)
                    }}
                    textHoverLeave={e => {
                        e.stopPropagation()
                        handleTextHovered(false)
                    }}
                    opacity={0.9}
                    annotationMode={annotationMode}
                    handleSelectAnnotation={handleSelectAnnotation}
                    selectedAnnotation={selectedAnnotation}
                    handleImgAnnotationHoverEnter={handleImgAnnotationHoverEnter}
                    handleImgAnnotationHoverLeave={handleImgAnnotationHoverLeave}
                />

                <TransformControls
                    showX={modelRotationState}
                    showY={modelRotationState}
                    showZ={modelRotationState}
                    enabled={modelRotationState}
                    object={gltfRef}
                    mode={'rotate'}
                    onObjectChange={() => {
                        modelRotate = gltfRef.current.rotation
                    }}
                />

                <AdaptivePixelRatio />

                <OrbitControls
                    enabled={!textHovered}
                    enableDamping={false}
                    makeDefault
                    onStart={() => {
                        moved = false
                    }}
                    onChange={() => {
                        moved = true
                    }}
                    onEnd={() => {
                        moved = false
                    }}
                />
            </>
        )
    }

    // const session = useSession({
    //     required: true,
    // })
    // if (file.isLoading || session.status === 'loading') {
    //     return <LoadingScreen />
    // }

    return (
        <Container
            maxW="100vw"
            maxH="100vh"
            w="100vw"
            h="100vh"
            overflow="hidden"
            padding={0}
        >
            <Flex
                direction="row-reverse"
                alignItems="center"
                justifyContent="center"
                h="100vh"
                overflow="hidden"
            >
                <Box
                    id="CanvasFrame"
                    maxW="75%"
                    w="75%"
                    maxH="100vh"
                    h="100vh"
                    bg={bgColor}
                    float="right"
                    position="relative"
                >
                    <Canvas
                        shadows={true}
                        camera={{
                            fov: 45,
                            near: 0.1,
                            far: 100,
                            position: [0, 0, 10],
                        }}
                        gl={{ preserveDrawingBuffer: true, antialias: true }}
                        dpr={[0.9, 2]}
                        performance={{ min: 0.5 }}
                        frameloop={annotationMode || measuringMode ? 'always' : 'demand'}
                    >
                        <Suspense
                            fallback={
                                <Html>
                                    <Loader
                                        dataStyles={{ color: '#000000' }} // Text styles
                                        dataInterpolation={p => `Loading ${p.toFixed(1)}%`} // Text
                                        initialState={active => active} // Initial black out state
                                    />
                                </Html>
                            }
                        >
                            {/* <Stats /> */}

                            <Scene />

                            <DirectLighting
                                directLightingData={directLighting}
                                setDirectLighting={setDirectLighting}
                                selectedDirectLight={selectedDirectLight}
                            />

                            <PointLighting
                                pointLightingData={pointLighting}
                                setPointLighting={setPointLighting}
                                selectedPointLight={selectedPointLight}
                            />

                            <SpotLighting
                                spotLightingData={spotLighting}
                                setSpotLighting={setSpotLighting}
                                selectedSpotLight={selectedSpotLight}
                            />

                            {envMapState ? (
                                <Environment
                                    background={envMapBG}
                                    blur={envMapBlur}
                                    files={envMapFile}
                                />
                            ) : (
                                <></>
                            )}

                            {envColorState ? (
                                <Environment background={envColorBG}>
                                    <mesh scale={100}>
                                        <sphereGeometry args={[1, 64, 64]} />
                                        <LayerMaterial side={THREE.BackSide}>
                                            <Color
                                                color={envColor}
                                                alpha={envColorAlpha}
                                                mode={envColorMode}
                                            />
                                            <Depth
                                                colorA={envDepthColorA}
                                                colorB={envDepthColorB}
                                                alpha={envDepthAlpha}
                                                mode={envDepthMode}
                                                near={0}
                                                far={300}
                                                origin={[100, 100, 100]}
                                            />
                                        </LayerMaterial>
                                    </mesh>
                                </Environment>
                            ) : (
                                <></>
                            )}

                            <Postprocessing
                                bloom={bloom}
                                brightnessContrast={brightnessContrast}
                                chromaticAberration={chromaticAberration}
                                depthOfField={depthOfField}
                                ssao={ssao}
                                toneMapping={toneMapping}
                                vignette={vignette}
                            />

                            <Preload all />
                        </Suspense>
                    </Canvas>
                    {!annotationMode && !loadingState && (
                        <ThreeHud
                            onClickRuler={() => {
                                setMeasuringMode(!measuringMode)
                                setCounterMeasuring(counterMeasuring + 1)
                            }}
                            measuringMode={measuringMode}
                        />
                    )}
                </Box>

                <div className="editForm3DMainContainer editForm3DSettings">
                    <Flex
                        justifyContent="space-evenly"
                        marginBottom="1.5rem"
                        flexWrap="wrap"
                    >
                        <Button
                            colorScheme={'green'}
                            // type="submit"
                            // isLoading={isLoading || isError}
                            onClick={handleSaveChanges}
                        >
                            Сохранить изменения
                        </Button>
                    </Flex>
                    <Box marginBottom="1.5rem">
                        <Tabs
                            isLazy
                            isManual
                            isFitted
                            variant="enclosed"
                            onChange={index => setTabIndex(index)}
                        >
                            <TabList>
                                <Tooltip label="Материалы" fontSize="md" closeOnClick={false}>
                                    <Tab
                                        borderColor="gray.200"
                                        borderBottom="0"
                                        _selected={{ color: 'white', bg: 'blue.600' }}
                                        onClick={() => {
                                            setAnnotationMode(false)
                                            setLightingMode(false)
                                            setSelectedDirectLight(-1)
                                            setSelectedPointLight(-1)
                                            setSelectedSpotLight(-1)
                                        }}
                                    >
                                        <Icon boxSize={4} as={BsImages} />
                                    </Tab>
                                </Tooltip>
                                <Tooltip label="Аннотации" fontSize="md" closeOnClick={false}>
                                    <Tab
                                        borderColor="gray.200"
                                        borderBottom="0"
                                        isDisabled={loadingState}
                                        _selected={{ color: 'white', bg: 'blue.600' }}
                                        onClick={() => {
                                            setAnnotationMode(true)
                                            setMeasuringMode(false)
                                            setLightingMode(false)
                                            setSelectedDirectLight(-1)
                                            setSelectedPointLight(-1)
                                            setSelectedSpotLight(-1)
                                        }}
                                    >
                                        <Icon boxSize={4} as={IoInformationCircle} />
                                    </Tab>
                                </Tooltip>
                                <Tooltip label="Свет" fontSize="md" closeOnClick={false}>
                                    <Tab
                                        borderColor="gray.200"
                                        borderBottom="0"
                                        isDisabled={loadingState}
                                        _selected={{ color: 'white', bg: 'blue.600' }}
                                        onClick={() => {
                                            setLightingMode(true)
                                            setAnnotationMode(false)
                                            setMeasuringMode(false)
                                        }}
                                    >
                                        <Icon boxSize={4} as={FaRegLightbulb} />
                                    </Tab>
                                </Tooltip>
                                <Tooltip label="Сцена" fontSize="md" closeOnClick={false}>
                                    <Tab
                                        borderColor="gray.200"
                                        borderBottom="0"
                                        isDisabled={loadingState}
                                        _selected={{ color: 'white', bg: 'blue.600' }}
                                        onClick={() => {
                                            setAnnotationMode(false)
                                            setMeasuringMode(false)
                                            setLightingMode(false)
                                            setSelectedDirectLight(-1)
                                            setSelectedPointLight(-1)
                                            setSelectedSpotLight(-1)
                                        }}
                                    >
                                        <Icon boxSize={4} as={TbBoxModel} />
                                    </Tab>
                                </Tooltip>
                                <Tooltip
                                    label="Постобработка"
                                    fontSize="md"
                                    closeOnClick={false}
                                >
                                    <Tab
                                        borderColor="gray.200"
                                        borderBottom="0"
                                        isDisabled={loadingState}
                                        _selected={{ color: 'white', bg: 'blue.600' }}
                                        onClick={() => {
                                            setAnnotationMode(false)
                                            setMeasuringMode(false)
                                            setLightingMode(false)
                                            setSelectedDirectLight(-1)
                                            setSelectedPointLight(-1)
                                            setSelectedSpotLight(-1)
                                        }}
                                    >
                                        <Icon boxSize={3.5} as={FaMagic} />
                                    </Tab>
                                </Tooltip>
                            </TabList>

                            <TabPanels>
                                <TabPanel padding="0" paddingTop="15px">
                                    <Box
                                        className="editForm3DSettings"
                                        maxH="80vh"
                                        h="80vh"
                                        paddingRight="0.5rem"
                                        overflowY="scroll"
                                    >
                                        <Badge>Material:</Badge>
                                        <Select
                                            // bg='blue.400'
                                            size="lg"
                                            borderColor="blue.400"
                                            mb="14px"
                                            value={selectedMaterial}
                                            onChange={e => setSelectedMaterial(e.target.value)}
                                            isDisabled={loadingState}
                                        >
                                            {model &&
                                                Object.keys(model.materials).map(mat => (
                                                    <option key={mat} value={mat}>
                                                        {mat}
                                                    </option>
                                                ))}
                                        </Select>
                                        {model &&
                                            Object.keys(model.materials).map(name => (
                                                <TexturesSettings
                                                    key={name}
                                                    material={name}
                                                    selectedMaterial={selectedMaterial}

                                                    colors={colors}
                                                    setColors={setColors}

                                                    colorMapsURLs={colorMapsURLs}
                                                    setcolorMapsURLs={setcolorMapsURLs}

                                                    normalMapsURLs={normalMapsURLs}
                                                    setnormalMapsURLs={setnormalMapsURLs}

                                                // colorMaps={colorMaps}
                                                />
                                            ))}
                                        {/* <Alert status='warning' variant='top-accent' mt={5}>
                      <AlertIcon />
                      Не загружайте текстуры если все отображается правильно.
                    </Alert>  */}
                                    </Box>
                                </TabPanel>

                                <TabPanel>
                                    {counter === 0 ? (
                                        <p>
                                            Кликните дважды в месте на модели, где хотите оставить
                                            Аннотацию.
                                        </p>
                                    ) : (
                                        <Box
                                            className="editForm3DSettings"
                                            maxH="75vh"
                                            h="75vh"
                                            paddingRight="0.5rem"
                                            overflowY="scroll"
                                        >
                                            {annotations.map((data, i) => (
                                                <Box
                                                    key={i}
                                                    ref={annotationsSettingsRefs[i]}
                                                    background="rgb(226 232 240 / 1)"
                                                    mb="0.75rem"
                                                    cursor="pointer"
                                                    onClick={() => {
                                                        setSelectedAnnotation(i)
                                                    }}
                                                >
                                                    <Flex justify="space-between">
                                                        <p
                                                            style={{
                                                                fontSize: '0.875rem',
                                                                lineHeight: '1.25rem',
                                                                margin: '0.25rem',
                                                            }}
                                                        >
                                                            {i + 1}
                                                        </p>
                                                        <Tooltip label="Удалить" fontSize="sm">
                                                            <Image
                                                                src={'/img/deleteicon.png'}
                                                                className="delete_icon"
                                                                alt="Delete"
                                                                title="Delete"
                                                                onClick={() => {
                                                                    handleDeleteAnnotation(i)
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </Flex>
                                                    <Flex
                                                        flexDirection="column"
                                                        justifyContent="center"
                                                        padding="0.25rem"
                                                    >
                                                        <Input
                                                            marginTop="0.25rem"
                                                            marginBottom="0.375rem"
                                                            _focus={{ background: 'white' }}
                                                            _hover={{ background: 'rgb(248 250 252 / 1)' }}
                                                            focusBorderColor="rgb(226, 232, 240)"
                                                            placeholder="Заголовок"
                                                            size="sm"
                                                            variant="filled"
                                                            value={data.title}
                                                            onChange={e => {
                                                                handleChangeTitle(e, i)
                                                            }}
                                                        />
                                                        {i === selectedAnnotation && (
                                                            <Textarea
                                                                marginBottom="0.375rem"
                                                                _focus={{ background: 'white' }}
                                                                _hover={{ background: 'rgb(248 250 252 / 1)' }}
                                                                focusBorderColor="rgb(226, 232, 240)"
                                                                placeholder="Описание"
                                                                size="sm"
                                                                variant="filled"
                                                                resize="vertical"
                                                                value={data.info}
                                                                onChange={e => {
                                                                    handleChangeInfo(e, i)
                                                                }}
                                                            />
                                                        )}
                                                    </Flex>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </TabPanel>

                                <TabPanel>
                                    <Box
                                        className="editForm3DSettings"
                                        maxH="80vh"
                                        h="80vh"
                                        paddingRight="0.5rem"
                                        overflowY="scroll"
                                    >
                                        <Tabs isManual isFitted variant="line">
                                            <TabList>
                                                <Tab
                                                    onClick={() => {
                                                        setMeasuringMode(false)
                                                        setSelectedPointLight(-1)
                                                        setSelectedSpotLight(-1)
                                                    }}
                                                >
                                                    Direct
                                                </Tab>
                                                <Tab
                                                    onClick={() => {
                                                        setMeasuringMode(false)
                                                        setSelectedDirectLight(-1)
                                                        setSelectedSpotLight(-1)
                                                    }}
                                                >
                                                    Point
                                                </Tab>
                                                <Tab
                                                    onClick={() => {
                                                        setMeasuringMode(false)
                                                        setSelectedDirectLight(-1)
                                                        setSelectedPointLight(-1)
                                                    }}
                                                >
                                                    Spot
                                                </Tab>
                                            </TabList>
                                            <TabPanels>
                                                <TabPanel pt={3} pb={3} pl={1} pr={1}>
                                                    <DirectLightingSettings
                                                        directLightingData={directLighting}
                                                        setDirectLighting={setDirectLighting}
                                                        selectedDirectLight={selectedDirectLight}
                                                        setSelectedDirectLight={setSelectedDirectLight}
                                                        handlePlaceDirectLight={handlePlaceDirectLight}
                                                        handleDeleteDirectLight={handleDeleteDirectLight}
                                                    />
                                                </TabPanel>
                                                <TabPanel pt={3} pb={3} pl={1} pr={1}>
                                                    <PointLightingSettings
                                                        pointLightingData={pointLighting}
                                                        setPointLighting={setPointLighting}
                                                        selectedPointLight={selectedPointLight}
                                                        setSelectedPointLight={setSelectedPointLight}
                                                        handlePlacePointLight={handlePlacePointLight}
                                                        handleDeletePointLight={handleDeletePointLight}
                                                    />
                                                </TabPanel>
                                                <TabPanel pt={3} pb={3} pl={1} pr={1}>
                                                    <SpotLightingSettings
                                                        spotLightingData={spotLighting}
                                                        setSpotLighting={setSpotLighting}
                                                        selectedSpotLight={selectedSpotLight}
                                                        setSelectedSpotLight={setSelectedSpotLight}
                                                        handlePlaceSpotLight={handlePlaceSpotLight}
                                                        handleDeleteSpotLight={handleDeleteSpotLight}
                                                    />
                                                </TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                    </Box>
                                </TabPanel>

                                <TabPanel>
                                    <SceneSettings
                                        modelRotationState={modelRotationState}
                                        setModelRotationState={setModelRotationState}
                                        modelRotation={modelRotation}
                                        setModelRotation={setModelRotation}
                                        envColorState={envColorState}
                                        envMapState={envMapState}
                                        setEnvColorState={setEnvColorState}
                                        setEnvMapState={setEnvMapState}
                                        envColorBG={envColorBG}
                                        envMapBG={envMapBG}
                                        setEnvColorBG={setEnvColorBG}
                                        setEnvMapBG={setEnvMapBG}
                                        envMapBlur={envMapBlur}
                                        envMapFile={envMapFile}
                                        setEnvMapBlur={setEnvMapBlur}
                                        setEnvMapFile={setEnvMapFile}
                                        bgColor={bgColor}
                                        envColor={envColor}
                                        envDepthColorA={envDepthColorA}
                                        envDepthColorB={envDepthColorB}
                                        setbgColor={setbgColor}
                                        setEnvColor={setEnvColor}
                                        setEnvDepthColorA={setEnvDepthColorA}
                                        setEnvDepthColorB={setEnvDepthColorB}
                                        envColorAlpha={envColorAlpha}
                                        envColorMode={envColorMode}
                                        envDepthAlpha={envDepthAlpha}
                                        envDepthMode={envDepthMode}
                                        setEnvColorAlpha={setEnvColorAlpha}
                                        setEnvColorMode={setEnvColorMode}
                                        setEnvDepthAlpha={setEnvDepthAlpha}
                                        setEnvDepthMode={setEnvDepthMode}
                                        handleSaveRotation={handleSaveRotation}
                                        handleResetRotation={handleResetRotation}
                                    />
                                </TabPanel>

                                <TabPanel>
                                    <PostprocessingSettings
                                        bloom={bloom}
                                        setBloom={setBloom}
                                        brightnessContrast={brightnessContrast}
                                        setBrightnessContrast={setBrightnessContrast}
                                        chromaticAberration={chromaticAberration}
                                        setChromaticAberration={setChromaticAberration}
                                        depthOfField={depthOfField}
                                        setDepthOfField={setDepthOfField}
                                        ssao={ssao}
                                        setSSAO={setSSAO}
                                        toneMapping={toneMapping}
                                        setToneMapping={setToneMapping}
                                        vignette={vignette}
                                        setVignette={setVignette}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </div>
            </Flex>
        </Container>
    )
}
