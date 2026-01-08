import { useEffect, useState } from "react";
import { getActivePromotions } from "@/api/apiClient";
import type { Promotion } from "@/api/apiClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PromotionsActives() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    getActivePromotions().then((res) => setPromotions(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {promotions.map((promo) => (
        <Card key={promo._id}>
          <CardHeader>
            <CardTitle>{promo.titre}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{promo.description}</p>
            <Badge variant="secondary">Active</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
