import { supabase } from "@/lib/supabase";
import { extractTextFromFile } from "@/lib/pdfParser";
import { generateResumeAnalysis } from "./aiService";

export interface AnalysisResult {
    fitScore: number;
    candidateSummary: string;
    matchedSkills: string[];
    missingSkills: string[];
    unrelatedSkills: string[];
    keyAchievements: string[];
    cultureFit: string;
    probingAreas: Array<{
        title: string;
        description: string;
    }>;
    seniorityAssessment: string;
    redFlags: string[];
    interviewQuestions: string[];
}

export const analyzeResume = async (file: File, jobDescription: string): Promise<AnalysisResult> => {
    try {
        // 1. Extract text from the uploaded file (PDF, TXT, etc)
        const resumeText = await extractTextFromFile(file);

        // 2. Send to Gemini for analysis
        const result = await generateResumeAnalysis(resumeText, jobDescription);

        return result;
    } catch (error) {
        console.error("Analysis process failed:", error);
        throw error;
    }
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
            candidate_summary: result.candidateSummary,
            matched_skills: result.matchedSkills,
            missing_skills: result.missingSkills,
            unrelated_skills: result.unrelatedSkills,
            key_achievements: result.keyAchievements,
            culture_fit: result.cultureFit,
            probing_areas: result.probingAreas,
            seniority_assessment: result.seniorityAssessment,
            red_flags: result.redFlags,
            interview_questions: result.interviewQuestions
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
