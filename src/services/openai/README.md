# OpenAI Integration with Structured Outputs

This implementation provides OpenAI-powered document analysis with structured outputs, designed to extract specific information from PDF documents with coordinate mapping that matches your existing OCRMark structure.

## Features

### 🎯 **Structured Data Extraction**

- Uses OpenAI's structured outputs feature for consistent response format
- Extracts document data with precise coordinate mapping
- Returns data in the same format as your existing OCRMark structure
- Confidence scoring for extraction reliability

### 📍 **Coordinate-Based Results**

- Returns x, y coordinates for each found data point
- Page-specific location mapping
- Compatible with your existing marker system
- Realistic coordinate estimation based on document layout

### 🔧 **Robust Error Handling**

- API connection validation
- Rate limiting detection
- Quota monitoring
- User-friendly error messages

## Setup

### 1. Install Dependencies

```bash
npm install
# No additional dependencies required - uses native fetch API
```

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. OpenAI API Key Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your environment variables
4. Ensure you have sufficient credits/quota

## Usage

### Basic Integration

Replace the mock handler in your App.tsx:

```tsx
import { createConversationMessageHandler } from '@/features/conversation/utils/conversationHandler'

// Replace mock handler with OpenAI
const handleSendMessage = createConversationMessageHandler(
  process.env.REACT_APP_OPENAI_API_KEY!
)
```

### Advanced Configuration

```tsx
import { createPDFConversationHandler } from '@/features/conversation/utils/conversationHandler'

const handleSendMessage = async (
  message: string,
  pdfData?: any
): Promise<string> => {
  const handler = createPDFConversationHandler({
    openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY!,
    model: 'gpt-4o-2024-08-06', // Supports structured outputs
    maxTokens: 2000,
    temperature: 0.1 // Low temperature for consistent extraction
  })

  return handler.handleMessage(message, pdfData)
}
```

## Response Structure

The OpenAI service returns structured data matching your OCRMark format:

```typescript
interface DocumentAnalysisResponse {
  extracted_data: {
    coordinates: OCRMark[] // Your existing type!
    summary: string
    confidence_score: number
  }
}

// Each coordinate follows your OCRMark structure:
interface OCRMark {
  x: number // X coordinate (0-600)
  y: number // Y coordinate (0-800)
  page: number // Page number (1-based)
  id: number // Unique identifier
  description: string // Data type description
  text: string // Extracted text content
}
```

## Example Queries

### Information Extraction

```
"Find all dates mentioned in this document"
"Extract the name of the author"
"Locate contact information"
"Find monetary amounts or prices"
```

### Coordinate-Specific Queries

```
"Where is the signature located?"
"Find the position of the document title"
"Locate all phone numbers and their coordinates"
"Extract table data with positions"
```

## API Schema

The service uses OpenAI's structured outputs with this exact schema:

```javascript
const documentAnalysisSchema = {
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
              x: { type: 'number' },
              y: { type: 'number' },
              page: { type: 'number' },
              id: { type: 'number' },
              description: { type: 'string' },
              text: { type: 'string' }
            },
            required: ['x', 'y', 'page', 'id', 'description', 'text']
          }
        },
        summary: { type: 'string' },
        confidence_score: { type: 'number', minimum: 0, maximum: 1 }
      },
      required: ['coordinates', 'summary', 'confidence_score']
    }
  }
}
```

## Error Handling

The service handles various error scenarios:

### API Errors

- Invalid API key
- Rate limiting
- Quota exceeded
- Network connectivity

### Response Validation

- Schema compliance checking
- Coordinate range validation
- Required field verification

### User-Friendly Messages

```
"Please configure your OpenAI API key"
"Rate limit exceeded. Please try again in a moment"
"API quota exceeded. Please check your OpenAI billing"
```

## Integration with Existing Features

### OCR Markers Integration

The returned coordinates can be directly used with your existing marker system:

```tsx
// The response coordinates are already in OCRMark format
const markers: OCRMark[] = response.extracted_data.coordinates

// Use with your existing Markers component
<Markers windowRef={windowRef} markers={markers} />
```

### PDF Text Extraction

For better results, extract text content from your PDF:

```tsx
const handleSendMessage = async (message: string, pdfData?: any) => {
  // Extract text content from PDF (implement based on your PDF viewer)
  const textContent = await extractTextFromPDF(pdfData)

  const enhancedPdfData = {
    ...pdfData,
    textContent: textContent
  }

  return handler.handleMessage(message, enhancedPdfData)
}
```

## Performance Considerations

### Token Usage

- Typical request: 200-500 tokens
- Response: 100-300 tokens
- Total cost: ~$0.001-0.005 per query

### Response Time

- Average: 2-4 seconds
- Complex documents: 4-8 seconds
- Network dependent

### Rate Limits

- Standard: 3 requests/minute
- Plus: 3,500 requests/minute
- Implement proper error handling

## Testing

### Connection Test

```tsx
const service = createOpenAIService(apiKey)
const isConnected = await service.testConnection()
```

### Example Response

```json
{
  "extracted_data": {
    "coordinates": [
      {
        "x": 150,
        "y": 90,
        "page": 1,
        "id": 1,
        "description": "Document Title",
        "text": "Annual Report 2024"
      },
      {
        "x": 100,
        "y": 200,
        "page": 1,
        "id": 2,
        "description": "Date",
        "text": "March 15, 2024"
      }
    ],
    "summary": "Found 2 data points including the document title and date",
    "confidence_score": 0.95
  }
}
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**

   - Check environment variable name
   - Verify .env.local file location
   - Restart development server

2. **"Rate limit exceeded"**

   - Implement request throttling
   - Check your OpenAI plan limits
   - Add retry logic with backoff

3. **"Invalid response format"**

   - Check OpenAI model version
   - Ensure using supported model (gpt-4o-2024-08-06+)
   - Verify structured outputs are enabled

4. **"Low confidence scores"**
   - Provide more specific queries
   - Include better PDF text extraction
   - Adjust temperature parameter

## Models Supported

- **gpt-4o-2024-08-06** ✅ (Recommended)
- **gpt-4o-mini** ✅ (Cost-effective)
- **gpt-4** ❌ (No structured outputs)
- **gpt-3.5-turbo** ❌ (No structured outputs)

## Cost Estimation

| Usage Level | Monthly Cost | Queries/Day |
| ----------- | ------------ | ----------- |
| Light       | $5-10        | 10-20       |
| Medium      | $20-50       | 50-100      |
| Heavy       | $100-200     | 200-500     |

## Security

- API keys stored in environment variables
- No sensitive data logged
- Client-side requests (consider proxy for production)
- Validate all responses before processing

---

This integration provides a powerful foundation for AI-powered document analysis while maintaining compatibility with your existing codebase and UI patterns.
