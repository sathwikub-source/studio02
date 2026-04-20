"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Wand2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { summarizeDocument } from "@/ai/flows/ai-document-summary"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  documentContent: z.string().min(1, {
    message: "Document content cannot be empty.",
  }),
})

export function DocumentSummaryTool() {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentContent: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSummary("")
    try {
      const result = await summarizeDocument(values)
      setSummary(result.summary)
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Wand2 className="size-6 text-accent" />
            <CardTitle>AI Document Summarizer</CardTitle>
        </div>
        <CardDescription>
          Paste your lecture material below to generate a quick summary for your students.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the text from your PDF, PPT, or other lecture materials here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </form>
        </Form>
        {(isLoading || summary) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Generated Summary</h3>
             {isLoading && !summary && <div className="mt-2 space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            </div>}
            {summary && (
              <Card className="mt-2 bg-secondary">
                <CardContent className="p-4">
                  <p className="text-sm text-secondary-foreground">{summary}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
