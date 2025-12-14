import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExperiencePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This section would detail your professional and academic experience.</p>
      </CardContent>
    </Card>
  );
}
