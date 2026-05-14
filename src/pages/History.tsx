import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { getAnalysisHistory, AnalysisResult } from "@/services/analysisService";
import Navbar from "@/components/Navbar";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface DBHistoryItem {
    id: string;
    created_at: string;
    file_name: string;
    job_description: string;
    fit_score: number;
    candidate_summary: string;
    matched_skills: string[];
    missing_skills: string[];
    unrelated_skills: string[];
    key_achievements: string[];
    culture_fit: string;
    probing_areas: Array<{ title: string; description: string; }>;
    seniority_assessment: string;
    red_flags: string[];
    interview_questions: string[];
}

const History = () => {
    const { user } = useUser();
    const [history, setHistory] = useState<DBHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (user) {
            getAnalysisHistory(user.id)
                .then((data) => {
                    setHistory(data as unknown as DBHistoryItem[]);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (selectedResult) {
        return (
            <div className="min-h-screen bg-background pt-20">
                <Navbar />
                <ResultsDashboard
                    result={selectedResult}
                    onReset={() => setSelectedResult(null)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-24 px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Analysis History</h1>
                        <p className="text-xs text-muted-foreground mt-2 font-mono">
                            Your User ID: {user?.id}
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/">New Analysis</Link>
                    </Button>
                </div>

                {history.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No History Found</h3>
                            <p className="text-muted-foreground mb-6">You haven't analyzed any resumes yet.</p>
                            <Button asChild>
                                <Link to="/">Start your first analysis</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={item.fit_score >= 80 ? "default" : item.fit_score >= 50 ? "secondary" : "destructive"}>
                                            {item.fit_score}% Match
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(item.created_at), "MMM d, yyyy")}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-2 text-lg truncate" title={item.file_name}>
                                        {item.file_name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-3 mb-4">
                                        {item.job_description}
                                    </CardDescription>
                                    <Button
                                        variant="outline"
                                        className="w-full group"
                                        onClick={() => {
                                            setSelectedResult({
                                                fitScore: item.fit_score,
                                                candidateSummary: item.candidate_summary,
                                                matchedSkills: item.matched_skills || [],
                                                missingSkills: item.missing_skills || [],
                                                unrelatedSkills: item.unrelated_skills || [],
                                                keyAchievements: item.key_achievements || [],
                                                cultureFit: item.culture_fit,
                                                probingAreas: item.probing_areas || [],
                                                seniorityAssessment: item.seniority_assessment,
                                                redFlags: item.red_flags || [],
                                                interviewQuestions: item.interview_questions || []
                                            });
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
