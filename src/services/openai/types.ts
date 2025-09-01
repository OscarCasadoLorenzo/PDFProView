import { OCRMark, PDFTextBlock } from '@/data/types'

// OpenAI structured output schema for document data extraction
export interface DocumentAnalysisResponse {
  extracted_data: {
    coordinates: OCRMark[]
    summary: string
    confidence_score: number
  }
}

// Request payload interface
export interface DocumentAnalysisRequest {
  user_query: string
  pdf_text_content?: string
  pdf_structured_data?: {
    text_blocks: PDFTextBlock[]
    page_count: number
    extraction_info?: any
  }
  pdf_metadata?: {
    filename: string
    page_count: number
  }
}

// OpenAI API configuration
export interface OpenAIConfig {
  apiKey: string
  model?: string
  maxTokens?: number
  temperature?: number
}

// Response schema for OpenAI structured outputs
export const documentAnalysisSchema = {
  type: 'object',
  properties: {
    extracted_data: {
      type: 'object',
      properties: {
        coordinates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              x: {
                type: 'number',
                description: 'X coordinate of the found data'
              },
              y: {
                type: 'number',
                description: 'Y coordinate of the found data'
              },
              page: {
                type: 'number',
                description: 'Page number where data was found'
              },
              id: {
                type: 'number',
                description: 'Unique identifier for this data point'
              },
              description: {
                type: 'string',
                description: 'Brief description of the data type'
              },
              text: {
                type: 'string',
                description: 'The actual extracted text content'
              }
            },
            required: ['x', 'y', 'page', 'id', 'description', 'text'],
            additionalProperties: false
          }
        },
        summary: {
          type: 'string',
          description: 'Summary of the analysis and findings'
        },
        confidence_score: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Confidence score for the extraction (0-1)'
        }
      },
      required: ['coordinates', 'summary', 'confidence_score'],
      additionalProperties: false
    }
  },
  required: ['extracted_data'],
  additionalProperties: false
}
