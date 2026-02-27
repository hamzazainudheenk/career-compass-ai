import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAnalysisHistory } from "@/services/analysisService";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HistoryItem {
    id: string;
    created_at: string;
    file_name: string;
    job_description: string;
    fit_score: number;
}

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getAnalysisHistory(user.id)
                .then((data) => {
                    setHistory(data as unknown as HistoryItem[]);
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-24 px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Analysis History</h1>
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
                                    <Button variant="outline" className="w-full group" disabled>
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
