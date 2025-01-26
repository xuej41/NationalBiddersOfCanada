"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ItemSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: 0,
    endTime: "",
    images: [] as File[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files!) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Submitting item:", formData)
    // Reset form after submission
    setFormData({ title: "", description: "", startingBid: 0, endTime: "", images: [] })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Item Title"
        required
      />
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Item Description"
        required
      />
      <Input
        type="number"
        name="startingBid"
        value={formData.startingBid}
        onChange={handleChange}
        placeholder="Starting Bid"
        min={0}
        step={0.01}
        required
      />
      <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
      <Input type="file" onChange={handleImageChange} accept="image/*" multiple required />
      <Button type="submit" className="rounded-full bg-gray-100">Submit Item</Button>
    </form>
  )
}

