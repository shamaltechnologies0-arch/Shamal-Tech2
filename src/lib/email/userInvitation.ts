import { sendEmail } from './index'

interface UserInvitationEmailOptions {
  to: string
  name: string
  resetURL: string
  roles: string[]
}

export async function sendUserInvitationEmail(
  options: UserInvitationEmailOptions
): Promise<void> {
  const roleNames = options.roles
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
    .join(', ')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Shamal Technologies CMS</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to Shamal Technologies CMS</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Hello ${options.name},</p>
        <p>You have been invited to access the Shamal Technologies Content Management System.</p>
        ${roleNames ? `<p><strong>Your Role(s):</strong> ${roleNames}</p>` : ''}
        <p>To get started, please set your password by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${options.resetURL}" 
             style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Set Your Password
          </a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't expect this invitation, please contact your administrator.
        </p>
        <p style="font-size: 12px; color: #666;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${options.resetURL}" style="color: #667eea; word-break: break-all;">${options.resetURL}</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Shamal Technologies. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  const text = `
Welcome to Shamal Technologies CMS

Hello ${options.name},

You have been invited to access the Shamal Technologies Content Management System.
${roleNames ? `Your Role(s): ${roleNames}` : ''}

To get started, please set your password by visiting this link:
${options.resetURL}

This link will expire in 24 hours. If you didn't expect this invitation, please contact your administrator.

© ${new Date().getFullYear()} Shamal Technologies. All rights reserved.
  `

  await sendEmail({
    to: options.to,
    subject: 'Welcome to Shamal Technologies CMS - Set Your Password',
    html,
    text,
  })
}

