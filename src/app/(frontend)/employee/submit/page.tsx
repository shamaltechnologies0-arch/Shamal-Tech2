import type { Metadata } from 'next'

import { EmployeeProfileForm } from '../../../components/EmployeeProfileForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'

export const metadata: Metadata = {
  title: 'Submit Your Profile | Shamal Technologies',
  description:
    'Submit your employee profile for your digital business card. Add your photo, contact details, and company profile.',
}

export default function EmployeeSubmitPage() {
  return (
    <main>
      <ScrollSection className="py-20">
        <div className="container mx-auto px-4">
          <ParallaxElement className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Submit Your Profile</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill in your details to create your digital business card. Your profile will be reviewed by an admin
              before it goes live. Once published, you&apos;ll receive a unique QR code link.
            </p>
          </ParallaxElement>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Employee Profile Form</CardTitle>
              <CardDescription>
                All fields marked with * are required. Your profile will be set to draft until an admin publishes it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeProfileForm />
            </CardContent>
          </Card>
        </div>
      </ScrollSection>
    </main>
  )
}
