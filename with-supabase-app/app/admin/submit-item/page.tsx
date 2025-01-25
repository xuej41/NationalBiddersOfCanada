import ItemSubmissionForm from "@/app/components/ItemSubmissionForm"

export default function SubmitItemPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Submit New Auction Item</h1>
      <ItemSubmissionForm />
    </div>
  )
}

