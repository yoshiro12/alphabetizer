"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession to check authentication
import { useRouter } from "next/navigation"; // For redirecting the user
import { Copy, Download, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function Alphabetizer() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter(); // Initialize router for redirection
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering before session is checked

  const [text, setText] = useState("");
  const [sorted, setSorted] = useState("");
  const [options, setOptions] = useState({
    removeDuplicates: false,
    lowercase: false,
    reverse: false,
    ignoreCase: false,
  });
  const [separator, setSeparator] = useState("newline");
  const [customSeparator, setCustomSeparator] = useState("");

  // Redirect immediately if session is unauthenticated
  useEffect(() => {
    if (status === "loading") {
      // While session is loading, keep loading state true
      return;
    }

    if (status === "unauthenticated") {
      // Redirect the user to the login page if unauthenticated
      router.push("/auth/login");
    } else {
      setLoading(false); // Session loaded and authenticated, stop loading
    }
  }, [status, router]);

  const handleSave = () => {
    const blob = new Blob([sorted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alphabetized-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${sorted}</pre>`);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert("Unable to open print window. Please allow pop-ups for this site.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sorted], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sorted-text.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  
  const handleSort = () => {
    let lines: string[];

    if (separator === "newline") {
      lines = text.split(/\n/);
    } else if (separator === "comma") {
      lines = text.split(",").map((item) => item.trim());
    } else if (separator === "custom" && customSeparator) {
      lines = text.split(new RegExp(customSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).map((item) => item.trim());
    } else {
      lines = [text]; // If no valid separator, treat the entire text as one item
    }

    let sortedLines = lines.filter((line) => line.trim() !== ""); // Remove empty lines

    if (options.ignoreCase) {
      sortedLines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    } else {
      sortedLines.sort();
    }

    if (options.removeDuplicates) {
      sortedLines = [...new Set(sortedLines)];
    }

    if (options.lowercase) {
      sortedLines = sortedLines.map((line) => line.toLowerCase());
    }

    if (options.reverse) {
      sortedLines.reverse();
    }

    setSorted(sortedLines.join("\n"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sorted);
  };

  // If session is still loading, return loading message or empty screen
  if (loading || status === "loading") {
    return <div>Loading...</div>; // You can show a loading spinner here
  }

  return (
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
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {separator === "custom" && (
              <Input
                type="text"
                placeholder="Enter custom separator"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
              />
            )}
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
          <Button variant="outline" onClick={handleSave} className="w-32">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handlePrint} className="w-32">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="w-32">
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
  );
}
