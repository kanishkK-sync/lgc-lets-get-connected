import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ConnectionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A list of your 8 connections would appear here.</p>
      </CardContent>
    </Card>
  );
}
