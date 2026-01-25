import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '../../../../payload.config'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  options?: string[] // Clickable options/buttons
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: {
    services?: Array<{ id: string; title: string; slug: string; heroDescription?: string }>
    products?: Array<{ id: string; name: string; slug: string; description?: string }>
    blogs?: Array<{ id: string; title: string; slug: string; description?: string; date: string }>
    careers?: Array<{ id: string; title: string; slug: string; location: string; department: string }>
  }
  conversationState?: {
    currentFlow?: 'services' | 'products' | 'blogs' | 'careers' | 'support' | null
    selectedItem?: string
    selectedItemId?: string // Store the ID for fetching full details
    waitingForSelection?: boolean
  }
}

// Fetch current website data
async function fetchWebsiteData() {
  const payload = await getPayload({ config: configPromise })

  const [services, products, blogs, careers] = await Promise.all([
    payload.find({
      collection: 'services',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 100,
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'products',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 100,
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 10,
      sort: '-date',
      depth: 0,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'career',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 50,
      depth: 0,
      overrideAccess: false,
    }),
  ])

  return {
    services: services.docs.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      heroDescription: typeof s.heroDescription === 'string' ? s.heroDescription : undefined,
    })),
    products: products.docs.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: typeof p.description === 'string' ? p.description : undefined,
    })),
    blogs: blogs.docs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      description: typeof b.description === 'string' ? b.description : undefined,
      date: b.date ? new Date(b.date).toISOString() : new Date().toISOString(),
    })),
    careers: careers.docs.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      location: typeof c.location === 'string' ? c.location : 'Saudi Arabia',
      department: typeof c.department === 'string' ? c.department : 'Other',
    })),
  }
}

// Intent detection
function detectIntent(message: string): {
  intent: 'services' | 'products' | 'blogs' | 'careers' | 'support' | 'greeting' | 'help' | 'unknown'
  confidence: number
} {
  const lowerMessage = message.toLowerCase().trim()

  // Greeting patterns
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|salam|السلام)/i.test(lowerMessage)) {
    return { intent: 'greeting', confidence: 0.9 }
  }

  // Services patterns
  const serviceKeywords = ['service', 'services', 'what do you offer', 'what services', 'offerings', 'solutions']
  if (serviceKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return { intent: 'services', confidence: 0.9 }
  }

  // Products patterns
  const productKeywords = ['product', 'products', 'drones', 'equipment', 'hardware', 'what products']
  if (productKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return { intent: 'products', confidence: 0.9 }
  }

  // Blogs patterns
  const blogKeywords = ['blog', 'blogs', 'article', 'articles', 'news', 'latest', 'posts', 'updates']
  if (blogKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return { intent: 'blogs', confidence: 0.9 }
  }

  // Careers patterns
  const careerKeywords = ['career', 'careers', 'job', 'jobs', 'position', 'positions', 'hiring', 'employment', 'vacancy']
  if (careerKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return { intent: 'careers', confidence: 0.9 }
  }

  // Support patterns
  const supportKeywords = ['help', 'support', 'issue', 'problem', 'question', 'inquiry', 'contact', 'assistance']
  if (supportKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return { intent: 'support', confidence: 0.8 }
  }

  // Help patterns
  if (/^(help|what can you do|how can you help|menu|options)/i.test(lowerMessage)) {
    return { intent: 'help', confidence: 0.9 }
  }

  // Check for numbers (might be selecting from a list)
  if (/^\d+$/.test(lowerMessage.trim())) {
    return { intent: 'unknown', confidence: 0.5 } // Could be a selection
  }

  return { intent: 'unknown', confidence: 0.3 }
}

// Find matching item in list
function findMatchingItem(
  query: string,
  items: Array<{ title?: string; name?: string; id: string }>,
): { id: string; title: string } | null {
  const lowerQuery = query.toLowerCase().trim()

  // Check for number selection
  const numberMatch = lowerQuery.match(/^\d+/)
  if (numberMatch) {
    const index = parseInt(numberMatch[0]) - 1
    if (index >= 0 && index < items.length) {
      const item = items[index]
      return {
        id: item.id,
        title: item.title || item.name || '',
      }
    }
  }

  // Check for name/title match
  for (const item of items) {
    const title = (item.title || item.name || '').toLowerCase()
    if (title.includes(lowerQuery) || lowerQuery.includes(title)) {
      return {
        id: item.id,
        title: item.title || item.name || '',
      }
    }
  }

  return null
}

// Helper function to extract text from rich text
function extractTextFromRichText(richText: any): string {
  if (typeof richText === 'string') return richText
  if (!richText || !richText.root) return ''
  
  let text = ''
  const extract = (node: any) => {
    if (node.text) text += node.text
    if (node.children) {
      node.children.forEach((child: any) => extract(child))
    }
  }
  extract(richText.root)
  return text.trim()
}

// Generate custom response
async function generateResponse(
  lastMessage: string,
  messages: ChatMessage[],
  context: ChatRequest['context'],
  conversationState: ChatRequest['conversationState'],
): Promise<{ response: string; options?: string[]; newState: ChatRequest['conversationState'] }> {
  const intent = detectIntent(lastMessage)
  let state = conversationState || { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false }

  // Handle selection if waiting for one
  if (state.waitingForSelection) {
    if (state.currentFlow === 'services' && context?.services) {
      const selected = findMatchingItem(lastMessage, context.services)
      if (selected) {
        const service = context.services.find((s) => s.id === selected.id)
        state = {
          currentFlow: 'services',
          selectedItem: selected.title,
          waitingForSelection: false,
        }
        return {
          response: `Great choice! Here's information about **${selected.title}**:\n\n${
            service?.heroDescription || 'This is one of our premium services.'
          }\n\nWould you like to:\n• Request a quotation\n• Talk to an expert\n• Explore related services\n• Go back to main menu`,
          newState: state,
        }
      }
    }

    if (state.currentFlow === 'products' && context?.products) {
      const selected = findMatchingItem(lastMessage, context.products)
      if (selected) {
        const product = context.products.find((p) => p.id === selected.id)
        state = {
          currentFlow: 'products',
          selectedItem: selected.title,
          selectedItemId: selected.id,
          waitingForSelection: false,
        }
        return {
          response: `Excellent! Here's information about **${selected.title}**:\n\n${
            product?.description ? extractTextFromRichText(product.description).substring(0, 200) + '...' : 'This is one of our premium products.'
          }`,
          options: ['Request a quotation', 'Get more details', 'Explore other products', 'Back to main menu'],
          newState: state,
        }
      }
    }

    if (state.currentFlow === 'blogs' && context?.blogs) {
      const selected = findMatchingItem(lastMessage, context.blogs)
      if (selected) {
        state = {
          currentFlow: 'blogs',
          selectedItem: selected.title,
          waitingForSelection: false,
        }
        return {
          response: `You selected: **${selected.title}**\n\nYou can read the full article on our website.`,
          options: ['See more blogs', 'Back to main menu'],
          newState: state,
        }
      }
    }

    if (state.currentFlow === 'careers' && context?.careers) {
      const selected = findMatchingItem(lastMessage, context.careers)
      if (selected) {
        const career = context.careers.find((c) => c.id === selected.id)
        state = {
          currentFlow: 'careers',
          selectedItem: selected.title,
          waitingForSelection: false,
        }
        return {
          response: `You're interested in: **${selected.title}**\n\n**Location:** ${career?.location || 'Saudi Arabia'}\n**Department:** ${career?.department || 'General'}\n\nTo apply, please visit our careers page or contact us at hello@shamal.sa`,
          options: ['See other positions', 'Back to main menu'],
          newState: state,
        }
      }
    }

    // If no match found
    return {
      response: "I didn't understand that selection. Please choose from the options below or type the name.",
      options: ['Back to main menu', 'Show services again', 'Show products again'],
      newState: state,
    }
  }

  // Handle intents
  switch (intent.intent) {
    case 'greeting':
      return {
        response: 'Hello 👋 Welcome to Shamal Technologies!\n\nHow may I help you today?',
        options: ['Services', 'Products', 'Latest Blogs', 'Careers', 'Customer Support', 'Talk to a Human'],
        newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
      }

    case 'help':
      return {
        response: 'I can help you with:',
        options: ['Services', 'Products', 'Latest Blogs', 'Careers', 'Customer Support', 'Talk to a Human'],
        newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
      }

    case 'services':
      if (!context?.services || context.services.length === 0) {
        return {
          response: "I'm sorry, we don't have any services listed at the moment. Please contact us at hello@shamal.sa for more information.",
          options: ['Back to main menu', 'Contact support', 'View products'],
          newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
        }
      }

      const servicesList = context.services
        .map((s, i) => `${i + 1}. ${s.title}${s.heroDescription ? ` - ${s.heroDescription.substring(0, 60)}...` : ''}`)
        .join('\n')

      return {
        response: `Here are our available services:\n\n${servicesList}\n\nPlease select a service by number or name to learn more.`,
        newState: {
          currentFlow: 'services',
          selectedItem: undefined,
          waitingForSelection: true,
        },
      }

    case 'products':
      if (!context?.products || context.products.length === 0) {
        return {
          response: "I'm sorry, we don't have any products listed at the moment. Please contact us at hello@shamal.sa for more information.",
          options: ['Back to main menu', 'Contact support', 'View services'],
          newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
        }
      }

      // Create options from products (limit to first 10 for UI)
      const productOptions = context.products.slice(0, 10).map((p) => p.name)
      if (context.products.length > 10) {
        productOptions.push('Show more products')
      }
      productOptions.push('Back to main menu')

      return {
        response: `Here are our available products. Please select one:`,
        options: productOptions,
        newState: {
          currentFlow: 'products',
          selectedItem: undefined,
          waitingForSelection: true,
        },
      }

    case 'blogs':
      if (!context?.blogs || context.blogs.length === 0) {
        return {
          response: "I'm sorry, we don't have any blog posts at the moment. Please check back later or contact us at hello@shamal.sa",
          options: ['Back to main menu', 'Contact support', 'View services'],
          newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
        }
      }

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const currentMonthBlogs = context.blogs.filter((b) => {
        const blogDate = new Date(b.date)
        return blogDate.getMonth() === currentMonth && blogDate.getFullYear() === currentYear
      })

      const blogsToShow = currentMonthBlogs.length > 0 ? currentMonthBlogs : context.blogs.slice(0, 5)
      const blogOptions = blogsToShow.map((b) => b.title)
      blogOptions.push('Back to main menu')

      const monthNote = currentMonthBlogs.length > 0 ? ' (Current Month)' : ''

      return {
        response: `Here are our latest blogs${monthNote}. Please select one:`,
        options: blogOptions,
        newState: {
          currentFlow: 'blogs',
          selectedItem: undefined,
          waitingForSelection: true,
        },
      }

    case 'careers':
      if (!context?.careers || context.careers.length === 0) {
        return {
          response: "We don't have any open positions at the moment. Please check back later or send your resume to hello@shamal.sa",
          options: ['Back to main menu', 'Contact support', 'View services'],
          newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
        }
      }

      // Create options from careers (limit to first 10 for UI)
      const careerOptions = context.careers.slice(0, 10).map((c) => `${c.title} - ${c.department}`)
      if (context.careers.length > 10) {
        careerOptions.push('Show more positions')
      }
      careerOptions.push('Back to main menu')

      return {
        response: `Here are our open positions. Please select one:`,
        options: careerOptions,
        newState: {
          currentFlow: 'careers',
          selectedItem: undefined,
          waitingForSelection: true,
        },
      }

    case 'support':
      return {
        response: 'I\'m here to help! What can I assist you with today?\n\nOr you can contact us directly at:\n📧 hello@shamal.sa',
        options: ['Technical issue', 'Billing question', 'Product inquiry', 'General question', 'Contact support team', 'Back to main menu'],
        newState: {
          currentFlow: 'support',
          selectedItem: undefined,
          waitingForSelection: false,
        },
      }

    default:
      // Check for follow-up actions
      const lowerMessage = lastMessage.toLowerCase()

      // Handle "Get more details" for products
      if (
        (lowerMessage.includes('more details') || lowerMessage.includes('get more')) &&
        state.currentFlow === 'products' &&
        state.selectedItemId
      ) {
        // Fetch full product details
        const payload = await getPayload({ config: configPromise })
        try {
          const product = await payload.findByID({
            collection: 'products',
            id: state.selectedItemId,
            depth: 1,
            overrideAccess: false,
          })

          if (product) {
            let details = `**${product.name}**\n\n`
            
            // Category and tag
            if (product.category) {
              details += `**Category:** ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}\n`
            }
            if (product.categoryTag) {
              details += `**Type:** ${product.categoryTag}\n`
            }
            details += '\n'

            // Full description
            if (product.description) {
              const descriptionText = extractTextFromRichText(product.description)
              if (descriptionText) {
                details += `**Description:**\n${descriptionText}\n\n`
              }
            }

            // Key Features
            if (product.keyFeatures && Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0) {
              details += `**Key Features:**\n`
              product.keyFeatures.forEach((feature: any) => {
                if (feature.feature) {
                  details += `• ${feature.feature}\n`
                }
              })
              details += '\n'
            }

            // Specifications
            if (product.specifications) {
              details += `**Specifications:**\n`
              if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
                Object.entries(product.specifications).forEach(([key, value]) => {
                  if (value !== null && value !== undefined) {
                    details += `• **${key}:** ${String(value)}\n`
                  }
                })
              } else if (Array.isArray(product.specifications)) {
                product.specifications.forEach((spec: any) => {
                  if (typeof spec === 'object' && spec !== null) {
                    Object.entries(spec).forEach(([key, value]) => {
                      if (value !== null && value !== undefined) {
                        details += `• **${key}:** ${String(value)}\n`
                      }
                    })
                  } else {
                    details += `• ${String(spec)}\n`
                  }
                })
              }
              details += '\n'
            }

            details += `For more information or to request a quotation, please contact us at hello@shamal.sa`

            return {
              response: details,
              options: ['Request a quotation', 'Explore other products', 'Back to main menu'],
              newState: state,
            }
          }
        } catch (error) {
          console.error('Error fetching product details:', error)
        }
      }

      if (lowerMessage.includes('quotation') || lowerMessage.includes('quote') || lowerMessage.includes('price')) {
        return {
          response: 'To request a quotation, please contact us at:\n\n📧 hello@shamal.sa\n\nOr fill out our contact form on the website. We\'ll get back to you as soon as possible!',
          options: ['Back to main menu', 'Contact support', 'View services', 'View products'],
          newState: state,
        }
      }

      if (lowerMessage.includes('expert') || lowerMessage.includes('talk to') || lowerMessage.includes('human')) {
        return {
          response: 'You can reach our team directly at:\n\n📧 hello@shamal.sa\n\nWe\'re here to help and will respond promptly!',
          options: ['Back to main menu', 'Request quotation', 'View services'],
          newState: state,
        }
      }

      if (lowerMessage.includes('back') || lowerMessage.includes('menu') || lowerMessage.includes('main')) {
        return {
          response: 'How may I help you today?',
          options: ['Services', 'Products', 'Latest Blogs', 'Careers', 'Customer Support', 'Talk to a Human'],
          newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
        }
      }

      // Default response
      return {
        response: 'I can help you with:',
        options: ['Services', 'Products', 'Latest Blogs', 'Careers', 'Customer Support', 'Talk to a Human'],
        newState: { currentFlow: null, selectedItem: undefined, selectedItemId: undefined, waitingForSelection: false },
      }
  }
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, context, conversationState } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Get last user message
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || ''

    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // Fetch website data if not provided
    const websiteData = context || (await fetchWebsiteData())

      // Generate response
      const { response, options, newState } = await generateResponse(lastUserMessage, messages, websiteData, conversationState)

    return NextResponse.json({
      message: response,
      options: options || [],
      context: websiteData,
      conversationState: newState,
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to fetch website data
export async function GET() {
  try {
    const data = await fetchWebsiteData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching website data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
