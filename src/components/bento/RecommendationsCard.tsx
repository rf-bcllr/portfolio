import { Card } from "@/components/ui/card";

export function RecommendationsCard() {
  return (
    <Card className="h-full p-6">
      <p className="text-sm text-muted-foreground">“Rafael is by far the most creative designer I've ever worked with (…) he really has the eye for details and ends up spotting flaws no one else does. (…), he is patient with his colleagues and always willing to help others improve their own skills (…)”</p>
      <p className="mt-3 font-medium">Inis Leahy - Senior Product Designer @Udemy</p>
      <div className="mt-6 h-px w-full bg-border" />
      <p className="mt-6 text-sm text-muted-foreground">“Rafael is my reference of a dedicated and curious designer. Always bringing something new to the table and exploring his own abilities to the fullest, he is a professional you can count on to deliver the best solutions to your client’s needs.”</p>
      <p className="mt-3 font-medium">Esdras Lopes - Advertisement & Media Specialist</p>
    </Card>
  );
}
