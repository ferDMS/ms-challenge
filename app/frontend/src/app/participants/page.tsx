"use client";

import { DataGridDemo } from "@/components/participants/CallsGridDemo";

export default function ParticipantsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">People</h1>
      <DataGridDemo />
    </div>
  );
}
