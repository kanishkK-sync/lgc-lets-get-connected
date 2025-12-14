import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyProjectsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This is where your personal projects would be listed.</p>
      </CardContent>
    </Card>
  );
}
