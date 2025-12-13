import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function NotificationsTabs() {
  const recentPush = [
    {
      title: "Welcome",
      message: "Welcome to Nauhub!",
      audience: "All Users",
      url: "",
    },
    {
      title: "Update",
      message: "New features released.",
      audience: "Premium Users",
      url: "https://nauhub.com/features",
    },
  ];
  const recentEmail = [
    {
      subject: "Account Activated",
      body: "Your account is now active.",
      audience: "New Users",
      url: "",
    },
    {
      subject: "Survey",
      body: "Please fill our survey.",
      audience: "All Users",
      url: "https://nauhub.com/survey",
    },
  ];
  return (
    <Tabs defaultValue="push">
      <TabsList>
        <TabsTrigger value="push">Push Notifications</TabsTrigger>
        <TabsTrigger value="email">Email Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="push">
        <form className="space-y-4 max-w-md">
          <Input placeholder="Title" required />
          <Textarea placeholder="Message" required />
          <Select required defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Target Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Action URL (optional)" type="url" />
          <Button type="submit">Send Push Notification</Button>
        </form>
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Recent Push Notifications</h4>
          <ul className="space-y-2">
            {recentPush.map((n, i) => (
              <li key={i} className="rounded p-3 bg-muted">
                <div className="font-medium mb-1">{n.title}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {n.message}
                </div>
                <div className="text-xs mb-1">Audience: {n.audience}</div>
                {n.url && (
                  <div className="text-xs mt-1">
                    Action:{" "}
                    <a
                      href={n.url}
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {n.url}
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
      <TabsContent value="email">
        <form className="space-y-4 max-w-md">
          <Input placeholder="Subject" required />
          <Textarea placeholder="Email Body" required />
          <Select required defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Target Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Action URL (optional)" type="url" />
          <Button type="submit">Send Email Notification</Button>
        </form>
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Recent Email Notifications</h4>
          <ul className="space-y-2">
            {recentEmail.map((n, i) => (
              <li key={i} className="rounded p-3 bg-muted">
                <div className="font-medium mb-1">{n.subject}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {n.body}
                </div>
                <div className="text-xs mb-1">Audience: {n.audience}</div>
                {n.url && (
                  <div className="text-xs mt-1">
                    Action:{" "}
                    <a
                      href={n.url}
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {n.url}
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
}
