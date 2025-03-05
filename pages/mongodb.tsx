"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading"; // Import Loading component
import Header from "@/components/Header";

const domain_url = process.env.NEXT_PUBLIC_CUSTOM_VALUE || "Change the value in on your .env file";

interface DataItem {
  filename: string;
  code: string;
}



export default function MongoDBPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [loadTime, setLoadTime] = useState(0);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  const fetchData = async (newPage: number, newLimit: number) => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const res = await fetch(`/api/files?page=${newPage}&limit=${newLimit}`);

      console.log("API Response Status:", res.status);
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);

      const responseData = await res.json();
      console.log("API Response Data:", responseData);

      const { data, totalPages } = responseData;
      setData(data || []);
      setTotalPages(totalPages);
      setLoadTime(Math.round(performance.now() - startTime));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="container mx-auto p-4 flex-1">
        {/* Top Controls */}
        <div className="flex items-center space-x-2">
            <label className="text-sm">Items per page:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number.parseInt(e.target.value))}
              className="border p-2 rounded bg-muted text-foreground"
              disabled={loading}
            >
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="250">250</option>
              <option value="350">350</option>
            </select>
          </div>



          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 mb-4">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1 || loading} variant="secondary">
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button onClick={() => setPage(page + 1)} disabled={page === totalPages || loading} variant="secondary">
              Next
            </Button>
          </div>


        {/* Table Section */}
        <Card>
          {/* <CardHeader>
            <CardTitle>File List</CardTitle>
          </CardHeader> */}
          <CardContent className="overflow-x-auto">
                {loading ? (
                <Loading /> // Reusable loading component
                ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
                ) : data.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/2">Filename</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium break-words">{item.filename} : {domain_url}/{item.code}</TableCell>
                      
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                ) : (
                <div className="text-center py-4">No data available.</div>
                )}
            
          </CardContent>
        </Card>

        {/* Bottom Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1 || loading} variant="secondary">
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button onClick={() => setPage(page + 1)} disabled={page === totalPages || loading} variant="secondary">
            Next
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Table fully loaded in {loadTime} ms</p>
        </div>
      </div>
    </div>
  );
}
