'use client'

import React, { useEffect, useRef } from 'react'
import { useForm } from '@payloadcms/ui'
import { DefaultEditView } from '@payloadcms/ui'
import './index.scss'

// Component that adds Update Password button next to Cancel button
const UserAccountEdit = (props: any) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { submit } = useForm()

  useEffect(() => {
    const addUpdateButton = () => {
      if (!containerRef.current) return

      // Find password field by looking for labels
      const allLabels = containerRef.current.querySelectorAll('label')
      let passwordContainer: Element | null = null

      for (const label of allLabels) {
        const text = label.textContent || ''
        if (text.includes('New Password')) {
          // Walk up the DOM to find the field container
          let parent: Element | null = label.parentElement
          while (parent && parent !== containerRef.current) {
            // Look for field container indicators
            if (
              parent.classList.contains('field-type') ||
              parent.hasAttribute('data-field-name') ||
              parent.querySelector('.field-label') !== null
            ) {
              passwordContainer = parent
              break
            }
            parent = parent.parentElement
          }
          if (passwordContainer) break
        }
      }

      if (!passwordContainer) return

      // Find Cancel button
      const buttons = passwordContainer.querySelectorAll('button')
      let cancelButton: HTMLButtonElement | null = null

      for (const btn of buttons) {
        const text = btn.textContent?.trim().toLowerCase()
        if (text === 'cancel' && btn instanceof HTMLButtonElement) {
          cancelButton = btn
          break
        }
      }

      if (!cancelButton) return

      // Check if Update button already exists
      if (passwordContainer.querySelector('.password-update-btn')) return

      // Create Update Password button
      const updateBtn = document.createElement('button')
      updateBtn.type = 'button'
      updateBtn.className = 'btn btn--style-primary password-update-btn'
      updateBtn.textContent = 'Update Password'
      
      updateBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        try {
          await submit()
        } catch (error) {
          console.error('Error updating password:', error)
        }
      })

      // Insert after Cancel button
      const cancelParent = cancelButton.parentElement
      if (cancelParent) {
        cancelParent.insertBefore(updateBtn, cancelButton.nextSibling)
      }
    }

    // Try multiple times with delays
    const timeouts = [
      setTimeout(addUpdateButton, 200),
      setTimeout(addUpdateButton, 500),
      setTimeout(addUpdateButton, 1000),
      setTimeout(addUpdateButton, 2000),
    ]

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      addUpdateButton()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: false,
      })
    }

    return () => {
      timeouts.forEach(clearTimeout)
      observer.disconnect()
    }
  }, [submit])

  return (
    <div className="user-account-edit" ref={containerRef}>
      <DefaultEditView {...props} />
    </div>
  )
}

export default UserAccountEdit
