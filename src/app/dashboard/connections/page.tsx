import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ConnectionsPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center py-20">
      <CardHeader>
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle className="mt-4">No Connections Yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">When you connect with other members, they will appear here.</p>
      </CardContent>
    </Card>
  );
}
