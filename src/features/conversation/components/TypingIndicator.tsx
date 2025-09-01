import { Avatar, Box, HStack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export const TypingIndicator: React.FC = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <HStack spacing={3} align="flex-start" justify="flex-start" w="full" mb={4}>
      <Avatar size="sm" name="Assistant" bg="secondary.500" color="white" />

      <Box
        maxW="70%"
        bg={bgColor}
        px={4}
        py={3}
        borderRadius="xl"
        borderBottomLeftRadius="md"
      >
        <HStack spacing={2}>
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            animation="pulse 1.4s ease-in-out infinite both"
            style={{ animationDelay: '0s' }}
          />
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            animation="pulse 1.4s ease-in-out infinite both"
            style={{ animationDelay: '0.2s' }}
          />
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            animation="pulse 1.4s ease-in-out infinite both"
            style={{ animationDelay: '0.4s' }}
          />
        </HStack>
      </Box>
    </HStack>
  )
}
