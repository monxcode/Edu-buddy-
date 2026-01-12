import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, QuizQuestion, StudySession } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_TEXT_FAST = 'gemini-2.5-flash';
// Using standard flash for multimodal as well for speed/cost in this demo, 
// though 'gemini-2.5-flash-image' is also valid for specific image tasks,
// 'gemini-2.5-flash' handles multimodal inputs well.

export const GeminiService = {
  
  /**
   * Solve a doubt (Text or Image)
   */
  async solveDoubt(
    query: string, 
    imageBase64: string | null, 
    profile: UserProfile, 
    funnyMode: boolean
  ): Promise<string> {
    const tone = funnyMode ? "funny, witty, and relatable like a cool older brother" : "kind, encouraging, and clear like a professional teacher";
    const languageInstruction = profile.language === 'Hindi' 
      ? "Answer primarily in Hindi." 
      : profile.language === 'Hinglish' 
        ? "Answer in a mix of Hindi and English (Hinglish), commonly used by Indian students." 
        : "Answer in English.";

    const systemPrompt = `You are EduGenie, an expert AI tutor for Indian students (${profile.board} Board, Class ${profile.classLevel}).
    Tone: ${tone}.
    Language: ${languageInstruction}
    Format: Use Markdown. Break down complex problems into steps. Use bold text for key terms.
    If the question is academic, provide a solution, explanation, and a similar practice example.`;

    try {
      const parts: any[] = [{ text: query }];
      if (imageBase64) {
        // Strip prefix if present
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        parts.unshift({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        });
      }

      const response = await ai.models.generateContent({
        model: MODEL_TEXT_FAST,
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemPrompt,
        }
      });

      return response.text || "Sorry, I couldn't generate an explanation.";
    } catch (error) {
      console.error("Doubt solver error:", error);
      return "Something went wrong while connecting to EduGenie.";
    }
  },

  /**
   * Generate Notes
   */
  async generateNotes(topic: string, style: 'Simple' | 'Exam' | 'Detailed', profile: UserProfile): Promise<string> {
    const prompt = `Generate comprehensive study notes for the topic: "${topic}".
    Context: Class ${profile.classLevel}, ${profile.board} Board.
    Style: ${style}.
    Language preference: ${profile.language} (or Hinglish if appropriate for better understanding).
    
    Structure the notes as:
    1. Introduction (Brief)
    2. Key Concepts (Bullet points)
    3. Detailed Explanation (Step-by-step)
    4. Important Formulas/Dates/Facts (Boxed or highlighted)
    5. Summary`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_TEXT_FAST,
        contents: prompt,
      });
      return response.text || "No notes generated.";
    } catch (error) {
      console.error("Notes generation error:", error);
      return "Failed to generate notes.";
    }
  },

  /**
   * Generate Quiz (JSON)
   */
  async generateQuiz(topic: string, count: number, profile: UserProfile): Promise<QuizQuestion[]> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_TEXT_FAST,
        contents: `Create a ${count} question quiz about "${topic}" for a Class ${profile.classLevel} student.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as QuizQuestion[];
    } catch (error) {
      console.error("Quiz gen error:", error);
      return [];
    }
  },

  /**
   * Generate Study Plan (JSON)
   */
  async generateStudyPlan(
    availableHours: number, 
    subjects: string[], 
    profile: UserProfile
  ): Promise<StudySession[]> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_TEXT_FAST,
        contents: `Create a 1-week study timetable.
        Student Profile: Class ${profile.classLevel}, ${profile.board}, Subjects: ${subjects.join(', ')}.
        Available daily hours: ${availableHours}.
        Focus: Balanced mix of learning and revision.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
                sessions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING, description: "Time slot (e.g., 4:00 PM - 5:00 PM)" },
                      subject: { type: Type.STRING },
                      topic: { type: Type.STRING, description: "Specific focus topic" }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as StudySession[];
    } catch (error) {
      console.error("Planner error:", error);
      return [];
    }
  }
};
