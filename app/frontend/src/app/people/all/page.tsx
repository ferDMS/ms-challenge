"use client";

import { DataGridDemo } from "@/components/people/CallsGridDemo";

export default function PeoplePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">People</h1>
      <DataGridDemo />
    </div>
  );
}
