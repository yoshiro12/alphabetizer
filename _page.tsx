"use client"

import { useState } from "react"
import { Copy, Download, Printer, Save } from "lucide-react"

import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AlphabetizerApp() {
  const [text, setText] = useState("")
  const [sorted, setSorted] = useState("")
  const [options, setOptions] = useState({
    removeDuplicates: false,
    lowercase: false,
    reverse: false,
    ignoreCase: false,
  })
  const [separator, setSeparator] = useState("newline")

  const handleSort = () => {
    let lines = text.split(/\n/)

    if (separator === "comma") {
      lines = text.split(",").map((item) => item.trim())
    }

    let sortedLines = [...lines].filter((line) => line.trim() !== "") // Remove empty lines

    if (options.ignoreCase) {
      sortedLines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    } else {
      sortedLines.sort()
    }

    if (options.removeDuplicates) {
      sortedLines = [...new Set(sortedLines)]
    }

    if (options.lowercase) {
      sortedLines = sortedLines.map((line) => line.toLowerCase())
    }

    if (options.reverse) {
      sortedLines.reverse()
    }

    setSorted(sortedLines.join("\n"))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sorted)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Text Alphabetizer</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-5xl">
        <div className="grid md:grid-cols-[300px_1fr] gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="duplicates"
                    checked={options.removeDuplicates}
                    onCheckedChange={(checked) => setOptions({ ...options, removeDuplicates: checked as boolean })}
                  />
                  <label htmlFor="duplicates">Remove Duplicates</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={options.lowercase}
                    onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked as boolean })}
                  />
                  <label htmlFor="lowercase">Make Lowercase</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reverse"
                    checked={options.reverse}
                    onCheckedChange={(checked) => setOptions({ ...options, reverse: checked as boolean })}
                  />
                  <label htmlFor="reverse">Reverse List</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignoreCase"
                    checked={options.ignoreCase}
                    onCheckedChange={(checked) => setOptions({ ...options, ignoreCase: checked as boolean })}
                  />
                  <label htmlFor="ignoreCase">Ignore Case When Sorting</label>
                </div>
              </div>

              <div className="space-y-2">
                <label>Separate Terms With:</label>
                <Select value={separator} onValueChange={(value) => setSeparator(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newline">New Line</SelectItem>
                    <SelectItem value="comma">Comma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enter Text to Alphabetize</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your list here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={handleSort} className="w-32">
                Alphabetize
              </Button>
              <Button variant="outline" onClick={handleCopy} className="w-32">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" className="w-32">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="w-32">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="w-32">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            {sorted && (
              <Card>
                <CardHeader>
                  <CardTitle>Sorted Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea value={sorted} readOnly className="min-h-[200px]" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

