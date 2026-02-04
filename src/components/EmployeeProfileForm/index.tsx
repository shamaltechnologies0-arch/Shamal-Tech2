'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { User, Phone, Mail, Linkedin, Globe, FileText, CheckCircle2, Briefcase } from 'lucide-react'

export function EmployeeProfileForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    phoneNumber: '',
    businessEmail: '',
    linkedInUrl: '',
    websiteUrl: '',
    companyProfileFolderUrl: '',
    companyWebsiteUrl: '',
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [arabicPdf, setArabicPdf] = useState<File | null>(null)
  const [englishPdf, setEnglishPdf] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [profileUrl, setProfileUrl] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const data = new FormData()
      data.append('fullName', formData.fullName)
      if (formData.position) data.append('position', formData.position)
      data.append('phoneNumber', formData.phoneNumber)
      data.append('businessEmail', formData.businessEmail)
      if (formData.linkedInUrl) data.append('linkedInUrl', formData.linkedInUrl)
      if (formData.websiteUrl) data.append('websiteUrl', formData.websiteUrl)
      if (formData.companyProfileFolderUrl) data.append('companyProfileFolderUrl', formData.companyProfileFolderUrl)
      if (formData.companyWebsiteUrl) data.append('companyWebsiteUrl', formData.companyWebsiteUrl)
      if (profileImage) data.append('profileImage', profileImage)
      if (arabicPdf) data.append('companyProfileArabic', arabicPdf)
      if (englishPdf) data.append('companyProfileEnglish', englishPdf)

      const response = await fetch('/api/employees/submit', {
        method: 'POST',
        body: data,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit profile')
      }

      setSubmitStatus('success')
      setProfileUrl(result.profileUrl || null)
      setFormData({
        fullName: '',
        position: '',
        phoneNumber: '',
        businessEmail: '',
        linkedInUrl: '',
        websiteUrl: '',
        companyProfileFolderUrl: '',
        companyWebsiteUrl: '',
      })
      setProfileImage(null)
      setArabicPdf(null)
      setEnglishPdf(null)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <Label htmlFor="fullName">
          <User className="inline h-4 w-4 mr-2" />
          Full Name *
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Dr. John Smith"
        />
      </div>

      <div>
        <Label htmlFor="position">
          <Briefcase className="inline h-4 w-4 mr-2" />
          Position / Job Title
        </Label>
        <Input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          placeholder="e.g. CEO, Senior Engineer"
        />
      </div>

      <div>
        <Label htmlFor="profileImage">
          <User className="inline h-4 w-4 mr-2" />
          Profile Photo *
        </Label>
        <Input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 5MB.</p>
      </div>

      <div>
        <Label htmlFor="phoneNumber">
          <Phone className="inline h-4 w-4 mr-2" />
          Phone Number *
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+966 5X XXX XXXX"
        />
      </div>

      <div>
        <Label htmlFor="businessEmail">
          <Mail className="inline h-4 w-4 mr-2" />
          Business Email *
        </Label>
        <Input
          id="businessEmail"
          name="businessEmail"
          type="email"
          required
          value={formData.businessEmail}
          onChange={handleChange}
          placeholder="name@company.com"
        />
      </div>

      <div>
        <Label htmlFor="linkedInUrl">
          <Linkedin className="inline h-4 w-4 mr-2" />
          LinkedIn Profile URL
        </Label>
        <Input
          id="linkedInUrl"
          name="linkedInUrl"
          type="url"
          value={formData.linkedInUrl}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div>
        <Label htmlFor="websiteUrl">
          <Globe className="inline h-4 w-4 mr-2" />
          Personal / Portfolio Website
        </Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://yoursite.com"
        />
      </div>

      <div>
        <Label htmlFor="companyProfileFolderUrl">
          <FileText className="inline h-4 w-4 mr-2" />
          OneDrive / Cloud Folder (Arabic & English PDFs)
        </Label>
        <Input
          id="companyProfileFolderUrl"
          name="companyProfileFolderUrl"
          type="url"
          value={formData.companyProfileFolderUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground mt-1">Or upload PDFs below</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyProfileArabic">Company Profile (Arabic) PDF</Label>
          <Input
            id="companyProfileArabic"
            name="companyProfileArabic"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setArabicPdf(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="companyProfileEnglish">Company Profile (English) PDF</Label>
          <Input
            id="companyProfileEnglish"
            name="companyProfileEnglish"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setEnglishPdf(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="companyWebsiteUrl">
          <Globe className="inline h-4 w-4 mr-2" />
          Company Website
        </Label>
        <Input
          id="companyWebsiteUrl"
          name="companyWebsiteUrl"
          type="url"
          value={formData.companyWebsiteUrl}
          onChange={handleChange}
          placeholder="https://shamal.sa"
        />
      </div>

      {submitStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Profile submitted successfully. An admin will review and publish it. Your profile URL will be available
            once published.
            {profileUrl && (
              <p className="mt-2 text-sm">
                Preview: <a href={profileUrl} className="underline" target="_blank" rel="noopener noreferrer">{profileUrl}</a>
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Profile'}
      </Button>
    </form>
  )
}
