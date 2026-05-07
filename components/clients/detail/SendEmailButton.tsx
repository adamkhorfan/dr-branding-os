"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailComposer } from "@/components/email/EmailComposer";
import type { Client } from "@/types/client";

interface SendEmailButtonProps {
  client: Client;
}

export function SendEmailButton({ client }: SendEmailButtonProps) {
  const [open, setOpen] = useState(false);

  const defaultTo = client.contacts[0]?.email ?? "";

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-fg-muted"
        onClick={() => setOpen(true)}
      >
        <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
        Send email
      </Button>

      <EmailComposer
        open={open}
        onOpenChange={setOpen}
        defaultTo={defaultTo}
        clientId={client.id}
      />
    </>
  );
}
