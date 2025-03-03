"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

      
      console.log("API Response Status:", res.status); // Debugging line
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  
      const responseData = await res.json();
      console.log("API Response Data:", responseData); // Debugging line
  
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
    <div className="p-6 w-full min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Pagination & Filters */}
      <div className="mb-4 p-2 flex justify-between items-center">
        <div>
          <label className="mr-2">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number.parseInt(e.target.value))}
            className="border p-1 rounded bg-gray-800 text-white"
            disabled={loading}
          >
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="250">250</option>
            <option value="350">350</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls (Top) */}
      <div className="flex justify-between mb-4">
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

      {/* Table */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>File List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-full overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium"><span className="w-full break-words">{item.filename} : https://anidl.ddlserverv1.me.in/dl/{item.code}</span></TableCell>
                     
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">No data available.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls (Bottom) */}
      <div className="flex justify-between mt-4">
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

      {/* Footer */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Table fully loaded in {loadTime} ms</p>
      </div>
    </div>
  );
}
