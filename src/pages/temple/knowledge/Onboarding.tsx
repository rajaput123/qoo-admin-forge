import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Users, BookOpen, FileText, Play } from "lucide-react";

const onboardingTracks = [
  {
    id: "TRACK-001",
    title: "New Employee Orientation",
    description: "Essential knowledge for all new temple staff",
    totalSteps: 8,
    completedSteps: 5,
    assignedTo: 3,
    steps: [
      { title: "Temple History & Values", completed: true, type: "document" },
      { title: "Daily Operations Overview", completed: true, type: "document" },
      { title: "Safety & Emergency Protocols", completed: true, type: "video" },
      { title: "Communication Guidelines", completed: true, type: "document" },
      { title: "IT Systems Training", completed: true, type: "video" },
      { title: "Department-Specific Training", completed: false, type: "document" },
      { title: "Compliance & Legal", completed: false, type: "document" },
      { title: "Final Assessment", completed: false, type: "quiz" },
    ],
  },
  {
    id: "TRACK-002",
    title: "Priest Onboarding",
    description: "Ritual procedures, schedules, and temple traditions",
    totalSteps: 6,
    completedSteps: 2,
    assignedTo: 1,
    steps: [
      { title: "Daily Puja Procedures", completed: true, type: "document" },
      { title: "Festival Calendar & Rituals", completed: true, type: "document" },
      { title: "Sacred Space Guidelines", completed: false, type: "document" },
      { title: "Devotee Interaction Protocol", completed: false, type: "document" },
      { title: "Special Ceremonies Guide", completed: false, type: "video" },
      { title: "Assessment", completed: false, type: "quiz" },
    ],
  },
  {
    id: "TRACK-003",
    title: "Volunteer Training",
    description: "Guide for temple volunteers and seva workers",
    totalSteps: 5,
    completedSteps: 5,
    assignedTo: 8,
    steps: [
      { title: "Welcome & Introduction", completed: true, type: "document" },
      { title: "Volunteer Responsibilities", completed: true, type: "document" },
      { title: "Crowd Management Basics", completed: true, type: "video" },
      { title: "First Aid Essentials", completed: true, type: "video" },
      { title: "Completion Certificate", completed: true, type: "quiz" },
    ],
  },
];

const KnowledgeOnboarding = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Onboarding</h1>
        <p className="text-sm text-muted-foreground mt-1">Structured learning tracks for new team members</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-foreground">{onboardingTracks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Learning Tracks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-foreground">{onboardingTracks.reduce((sum, t) => sum + t.assignedTo, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Learners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-foreground">{onboardingTracks.filter(t => t.completedSteps === t.totalSteps).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed Tracks</p>
          </CardContent>
        </Card>
      </div>

      {/* Tracks */}
      <div className="space-y-4">
        {onboardingTracks.map((track) => {
          const progress = Math.round((track.completedSteps / track.totalSteps) * 100);
          const isComplete = progress === 100;

          return (
            <Card key={track.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {track.title}
                      {isComplete && <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Complete</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{track.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> {track.assignedTo} assigned
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{track.completedSteps}/{track.totalSteps} steps</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {track.steps.map((step, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${step.completed ? "bg-muted/30" : "hover:bg-accent/50"} transition-colors`}>
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm flex-1 ${step.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{step.title}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {step.type === "video" && <Play className="h-2.5 w-2.5 mr-1" />}
                        {step.type === "document" && <FileText className="h-2.5 w-2.5 mr-1" />}
                        {step.type === "quiz" && <BookOpen className="h-2.5 w-2.5 mr-1" />}
                        {step.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeOnboarding;
