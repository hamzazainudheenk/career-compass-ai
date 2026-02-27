import { supabase } from "@/lib/supabase";

export interface AnalysisResult {
    fitScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    unrelatedSkills: string[];
    suggestions: Array<{
        title: string;
        description: string;
        priority: "high" | "medium" | "low";
    }>;
}

// Mock analysis logic (kept from original Index.tsx but moved here)
const mockAnalysisResult: AnalysisResult = {
    fitScore: 72,
    matchedSkills: [
        "React", "TypeScript", "JavaScript", "REST APIs", "Git",
        "Agile", "Problem Solving", "Team Collaboration"
    ],
    missingSkills: [
        "GraphQL", "AWS", "Docker", "CI/CD", "Kubernetes"
    ],
    unrelatedSkills: [
        "Photoshop", "Video Editing", "Public Speaking"
    ],
    suggestions: [
        {
            title: "Add GraphQL Experience",
            description: "The job requires GraphQL expertise. Consider adding any GraphQL projects or coursework to your resume, or highlight any API development experience that could transfer.",
            priority: "high",
        },
        {
            title: "Highlight Cloud Experience",
            description: "AWS knowledge is important for this role. If you have any cloud experience (even personal projects), make sure to include it prominently.",
            priority: "high",
        },
        {
            title: "Include DevOps Skills",
            description: "Docker and CI/CD are mentioned in requirements. Add any experience with containerization, deployment pipelines, or infrastructure as code.",
            priority: "medium",
        },
        {
            title: "Quantify Your Achievements",
            description: "Your matched skills are strong. Make them more impactful by adding metrics (e.g., 'Improved app performance by 40%').",
            priority: "medium",
        },
        {
            title: "Tailor Your Summary",
            description: "Customize your resume summary to mention the specific technologies and values mentioned in this job description.",
            priority: "low",
        },
    ],
};

export const analyzeResume = async (file: File, jobDescription: string): Promise<AnalysisResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Return mock result with random score variation
    const randomScore = Math.floor(Math.random() * 30) + 55;
    return {
        ...mockAnalysisResult,
        fitScore: randomScore,
    };
};

export const saveAnalysisResult = async (
    userId: string,
    fileName: string,
    jobDescription: string,
    result: AnalysisResult
) => {
    const { error } = await supabase
        .from('analysis_results')
        .insert({
            user_id: userId,
            file_name: fileName,
            job_description: jobDescription,
            fit_score: result.fitScore,
            matched_skills: result.matchedSkills,
            missing_skills: result.missingSkills,
            unrelated_skills: result.unrelatedSkills,
            suggestions: result.suggestions
        });

    if (error) {
        console.error("Error saving analysis:", error);
        throw error;
    }
};

export const getAnalysisHistory = async (userId: string) => {
    const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching history:", error);
        throw error;
    }

    return data;
};
