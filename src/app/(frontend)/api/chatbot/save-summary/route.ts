import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '../../../../../payload.config'
import { sendEmail } from '../../../../../lib/email'

interface ChatSummary {
  userName?: string
  userEmail?: string
  selectedItem?: string
  itemType?: 'service' | 'product' | 'blog' | 'career' | 'support' | 'other'
  conversation: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  keyQuestions?: string[]
  finalOutcome?: string
}

export async function POST(request: Request) {
  try {
    const body: ChatSummary = await request.json()

    const payload = await getPayload({ config: configPromise })

    // Save to database
    const summary = await payload.create({
      collection: 'chat-summaries',
      data: {
        userName: body.userName,
        userEmail: body.userEmail,
        selectedItem: body.selectedItem,
        itemType: body.itemType || 'other',
        conversation: body.conversation.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp, // Keep as string (ISO format) - Payload date field accepts ISO strings
        })),
        keyQuestions: body.keyQuestions?.map((q) => ({ question: q })) || [],
        finalOutcome: body.finalOutcome,
        emailSent: false,
      },
    })

    // Generate email content
    const emailHtml = `
      <h2>New Chat Summary - Shamal Technologies</h2>
      
      ${body.userName ? `<p><strong>User Name:</strong> ${body.userName}</p>` : ''}
      ${body.userEmail ? `<p><strong>Email:</strong> ${body.userEmail}</p>` : ''}
      ${body.selectedItem ? `<p><strong>Selected Item:</strong> ${body.selectedItem}</p>` : ''}
      ${body.itemType ? `<p><strong>Item Type:</strong> ${body.itemType}</p>` : ''}
      
      ${body.keyQuestions && body.keyQuestions.length > 0 ? `
        <h3>Key Questions:</h3>
        <ul>
          ${body.keyQuestions.map((q) => `<li>${q}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${body.finalOutcome ? `<p><strong>Final Outcome:</strong> ${body.finalOutcome}</p>` : ''}
      
      <h3>Conversation:</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ${body.conversation
          .map(
            (msg) => `
          <div style="margin-bottom: 10px;">
            <strong>${msg.role === 'user' ? 'User' : 'Assistant'}:</strong>
            <p style="margin: 5px 0; white-space: pre-wrap;">${msg.content}</p>
            <small style="color: #666;">${new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        `,
          )
          .join('')}
      </div>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        This summary was automatically generated from the chatbot conversation.
      </p>
    `

    const emailText = `
New Chat Summary - Shamal Technologies

${body.userName ? `User Name: ${body.userName}` : ''}
${body.userEmail ? `Email: ${body.userEmail}` : ''}
${body.selectedItem ? `Selected Item: ${body.selectedItem}` : ''}
${body.itemType ? `Item Type: ${body.itemType}` : ''}

${body.keyQuestions && body.keyQuestions.length > 0 ? `Key Questions:\n${body.keyQuestions.map((q) => `- ${q}`).join('\n')}` : ''}

${body.finalOutcome ? `Final Outcome: ${body.finalOutcome}` : ''}

Conversation:
${body.conversation.map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n[${new Date(msg.timestamp).toLocaleString()}]`).join('\n\n')}
    `

    // Send email
    try {
      await sendEmail({
        to: 'hello@shamal.sa',
        subject: `New Chat Summary${body.userName ? ` from ${body.userName}` : ''}`,
        html: emailHtml,
        text: emailText,
      })

      // Update summary with email sent status
      await payload.update({
        collection: 'chat-summaries',
        id: summary.id,
        data: {
          emailSent: true,
          emailSentAt: new Date().toISOString(),
        },
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    // Optionally send copy to user if email provided
    if (body.userEmail && body.userEmail !== 'hello@shamal.sa') {
      try {
        await sendEmail({
          to: body.userEmail,
          subject: 'Chat Summary - Shamal Technologies',
          html: `
            <h2>Thank you for chatting with us!</h2>
            <p>Here's a summary of our conversation:</p>
            ${emailHtml}
            <p>If you have any further questions, please don't hesitate to contact us at hello@shamal.sa</p>
          `,
          text: `Thank you for chatting with us! Here's a summary of our conversation:\n\n${emailText}`,
        })
      } catch (userEmailError) {
        console.error('Error sending user email:', userEmailError)
        // Don't fail the request if user email fails
      }
    }

    return NextResponse.json({ success: true, id: summary.id })
  } catch (error) {
    console.error('Error saving chat summary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

