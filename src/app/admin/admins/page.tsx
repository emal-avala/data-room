"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminsPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState("");

  async function load() {
    const response = await fetch("/api/admin/admins");
    if (response.ok) {
      const body = await response.json();
      setEmails(body.admins ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The owner account in <code>SUPERADMIN_EMAIL</code> cannot be removed.
      </p>
      <form
        className="mt-6 flex gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          await fetch("/api/admin/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: value }),
          });
          setValue("");
          await load();
        }}
      >
        <input
          className="h-9 flex-1 rounded-md border border-border px-3 text-sm"
          placeholder="partner@example.com"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="mt-6 container-box divide-y divide-border">
        {emails.map((email) => (
          <li key={email} className="flex items-center justify-between p-4 text-sm">
            {email}
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await fetch("/api/admin/admins", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                await load();
              }}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
