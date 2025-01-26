"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ItemSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: 0,
    end_time: "",
    min_increase: 0,
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "starting_price" || name === "min_increase" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const backendData = {
        title: formData.title,
        description: formData.description,
        starting_price: formData.starting_price,
        end_time: formData.end_time,
        min_increase: formData.min_increase,
        images: formData.images,
      };
  
      const response = await fetch("http://localhost:3000/api/auction_items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Successfully submitted item:", result);
  
      setFormData({
        title: "",
        description: "",
        starting_price: 0,
        end_time: "",
        min_increase: 0,
        images: [],
      });
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Submission failed. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 text-sm font-medium">
          Item Name
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter item name"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter item description"
          required
        />
      </div>
      <div>
        <label htmlFor="starting_price" className="block mb-2 text-sm font-medium">
          Starting Bid Price
        </label>
        <Input
          type="number"
          id="starting_price"
          name="starting_price"
          value={formData.starting_price}
          onChange={handleChange}
          placeholder="Enter starting bid price"
          min={0}
          step={0.01}
          required
        />
      </div>
      <div>
        <label htmlFor="end_time" className="block mb-2 text-sm font-medium">
          End Date & Time
        </label>
        <Input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="min_increase" className="block mb-2 text-sm font-medium">
          Minimum Bid Increase (Optional)
        </label>
        <Input
          type="number"
          id="min_increase"
          name="min_increase"
          value={formData.min_increase}
          onChange={handleChange}
          placeholder="Enter minimum bid increment"
          min={0}
          step={0.01}
        />
      </div>
      <div>
        <label htmlFor="images" className="block mb-2 text-sm font-medium">
          Upload Images
        </label>
        <Input
          type="file"
          id="images"
          onChange={handleImageChange}
          accept="image/*"
          multiple
        />
      </div>
      <Button type="submit" className="focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full transition-colors duration-300 hover:bg-gray-500">Submit Item</Button>
    </form>
  );
}
