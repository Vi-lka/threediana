import { Box, Flex, Icon, Tooltip } from '@chakra-ui/react'
import { RxRulerSquare } from 'react-icons/rx'

export type ThreeHudProps = {
  onClickRuler: () => void
  measuringMode: boolean
}

export default function ThreeHud(props: ThreeHudProps) {
  return (
    <Flex direction="row-reverse" className="hud-container">
      <Tooltip hasArrow closeOnClick={false} label="Линейка">
        <Box
          w="40px"
          h="38px"
          m={2}
          cursor="pointer"
          textAlign="center"
          userSelect="none"
          onClick={props.onClickRuler}
        >
          <Icon
            as={RxRulerSquare}
            width="90%"
            height="90%"
            transition="0.15s ease-in-out"
            borderRadius={props.measuringMode ? '10px' : '5px'}
            p={props.measuringMode ? '8px' : '5px'}
            color="white"
            backgroundColor={props.measuringMode ? 'blue.300' : 'blackAlpha.50'}
            _hover={
              props.measuringMode
                ? {
                    padding: '8px',
                    borderRadius: '10px',
                    backgroundColor: 'blue.300',
                    transition: '0.15s ease-in-out',
                  }
                : {
                    padding: '8px',
                    borderRadius: '10px',
                    backgroundColor: 'blackAlpha.800',
                    transition: '0.15s ease-in-out',
                  }
            }
            filter="drop-shadow( 0px 0px 1px rgba(0, 0, 0, .5))"
          />
        </Box>
      </Tooltip>
      {/* <Box
        w='40px' 
        h='38px' 
        m={2}
        cursor='pointer'
        textAlign='center'
        userSelect='none'
      >
        HUD
      </Box> */}
    </Flex>
  )
}
