"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingState from "@/components/loading-state";
import { formatDate } from "@/lib/utils";
import {
  useSupportTicket,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAddTicketReply,
  useResolveTicket,
  useCloseTicket,
} from "@/hooks/use-support-tickets";
import { useUsers } from "@/hooks/use-users";
import { useAssignTicket } from "@/hooks/use-support-tickets";
import { toast } from "sonner";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "@/lib/icons";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "open":
      return "default";
    case "pending":
    case "awaiting_reply":
      return "secondary";
    case "in_progress":
      return "default";
    case "resolved":
      return "outline";
    case "closed":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    movie_request: "Movie Request",
    series_request: "Series Request",
    technical_issue: "Technical Issue",
    billing: "Billing",
    account: "Account",
    feedback: "Feedback",
    other: "Other",
  };
  return labels[category] || category;
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketNumber = params.ticketNumber as string;

  const { data: ticket, isLoading } = useSupportTicket(ticketNumber);
  const { data: users = [] } = useUsers();
  const adminUsers = users.filter((u) => u.role === "admin");

  const [replyMessage, setReplyMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("unassigned");
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const updateStatusMutation = useUpdateTicketStatus();
  const updatePriorityMutation = useUpdateTicketPriority();
  const assignTicketMutation = useAssignTicket();
  const addReplyMutation = useAddTicketReply();
  const resolveTicketMutation = useResolveTicket();
  const closeTicketMutation = useCloseTicket();

  // Update form values when ticket data changes
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setAssignedTo(ticket.assigned_to?.toString() || "unassigned");
    }
  }, [ticket]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">Ticket not found</p>
          <Button
            onClick={() => router.push("/support-tickets")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        ticketNumber,
        status: newStatus as any,
      });
      setStatus(newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await updatePriorityMutation.mutateAsync({
        ticketNumber,
        priority: newPriority as any,
      });
      setPriority(newPriority);
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleAssign = async (adminId: string) => {
    if (!adminId || adminId === "unassigned") return;
    try {
      await assignTicketMutation.mutateAsync({
        ticketNumber,
        adminId: parseInt(adminId),
      });
      setAssignedTo(adminId);
      toast.success("Ticket assigned successfully");
    } catch (error) {
      toast.error("Failed to assign ticket");
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      toast.error("Please enter resolution notes");
      return;
    }

    try {
      await resolveTicketMutation.mutateAsync({
        ticketNumber,
        resolutionNotes: resolutionNotes.trim(),
      });
      toast.success("Ticket resolved successfully");
      setResolveDialogOpen(false);
      setResolutionNotes("");
    } catch (error) {
      toast.error("Failed to resolve ticket");
    }
  };

  const handleClose = async () => {
    try {
      await closeTicketMutation.mutateAsync({ ticketNumber });
      toast.success("Ticket closed successfully");
    } catch (error) {
      toast.error("Failed to close ticket");
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await addReplyMutation.mutateAsync({
        ticketNumber,
        message: replyMessage,
        isInternalNote,
      });
      setReplyMessage("");
      setIsInternalNote(false);
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const breadcrumbs = [
    { title: "Support Tickets", url: "/support-tickets" },
    { title: ticket.ticket_number },
  ];

  const replies = ticket.replies || [];
  const sortedReplies = [...replies].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageWrapper
        title={`Ticket ${ticket.ticket_number}`}
        description={ticket.subject}
      >
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/support-tickets")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              {ticket.status !== "resolved" && ticket.status !== "closed" && (
                <Button
                  variant="outline"
                  onClick={() => setResolveDialogOpen(true)}
                  disabled={resolveTicketMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
              )}
              {ticket.status !== "closed" && (
                <Button
                  variant="destructive"
                  onClick={handleClose}
                  disabled={closeTicketMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
          </div>

          {/* Ticket Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                  <CardDescription className="mt-2">
                    {ticket.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(ticket.status)}>
                    {ticket.status
                      .split("_")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Badge>
                  <Badge variant={getPriorityVariant(ticket.priority)}>
                    {ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Category
                    </Label>
                    <p className="mt-1">{getCategoryLabel(ticket.category)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      User
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{ticket.user?.name || "N/A"}</span>
                      <span className="text-muted-foreground">
                        ({ticket.user?.email || ticket.user?.phone || "N/A"})
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Created
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Status</Label>
                    <Select
                      value={status || ticket.status}
                      onValueChange={handleStatusChange}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="awaiting_reply">
                          Awaiting Reply
                        </SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Priority</Label>
                    <Select
                      value={priority || ticket.priority}
                      onValueChange={handlePriorityChange}
                      disabled={updatePriorityMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Assign To</Label>
                    <Select
                      value={
                        assignedTo ||
                        ticket.assigned_to?.toString() ||
                        "unassigned"
                      }
                      onValueChange={handleAssign}
                      disabled={assignTicketMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {adminUsers.map((admin) => (
                          <SelectItem
                            key={admin.id}
                            value={admin.id.toString()}
                          >
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {ticket.resolution_notes && (
                <div className="mt-6 pt-6 border-t">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Resolution Notes
                  </Label>
                  <p className="mt-2 text-sm">{ticket.resolution_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Replies Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Replies ({replies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Original Ticket */}
              <div className="border-l-4 border-primary pl-4 p-2 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {ticket.user?.name || "User"}
                    </span>
                    <Badge variant="outline">Original</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
                <p className="text-sm">{ticket.description}</p>
              </div>

              <Separator />

              {/* Replies */}
              {sortedReplies.map((reply) => (
                <div
                  key={reply.id}
                  className={`border-l-4 pl-4 p-2 rounded-xl ${
                    reply.is_internal_note
                      ? "border-yellow-500 bg-muted dark:bg-yellow-950/20"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {reply.user?.name || "Admin"}
                      </span>
                      {reply.is_admin_reply && (
                        <Badge variant="default">Admin</Badge>
                      )}
                      {reply.is_internal_note && (
                        <Badge variant="secondary">Internal Note</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        Attachments: {reply.attachments.length}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Reply Form */}
              <Separator className="my-6" />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reply">Add Reply</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your reply here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal"
                    checked={isInternalNote}
                    onCheckedChange={(checked) =>
                      setIsInternalNote(checked === true)
                    }
                  />
                  <Label
                    htmlFor="internal"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Mark as internal note (not visible to user)
                  </Label>
                </div>
                <Button
                  onClick={handleReply}
                  disabled={addReplyMutation.isPending || !replyMessage.trim()}
                >
                  {addReplyMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>

      {/* Resolve Ticket Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Please provide resolution notes before resolving this ticket. This
              information will be visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Enter resolution notes..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResolveDialogOpen(false);
                setResolutionNotes("");
              }}
              disabled={resolveTicketMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              disabled={
                resolveTicketMutation.isPending || !resolutionNotes.trim()
              }
            >
              {resolveTicketMutation.isPending
                ? "Resolving..."
                : "Resolve Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
