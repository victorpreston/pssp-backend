import { Injectable } from '@nestjs/common';
import { CategoryScores } from '../../../shared/types/scoring.types';
import { ReadinessLevel } from '../../../shared/types/readiness.types';

interface PromptContext {
  scores: CategoryScores;
  overall_score: number;
  readiness_level: ReadinessLevel;
  strengths: string[];
  growthAreas: string[];
  program?: string;
  goal?: string;
}

/** Builds structured prompts for AI recommendation generation */
@Injectable()
export class PromptBuilderService {
  /**
   * Generate a comprehensive prompt for AI recommendation generation
   */
  buildRecommendationPrompt(context: PromptContext): string {
    const {
      scores,
      overall_score,
      readiness_level,
      strengths,
      growthAreas,
      program,
      goal,
    } = context;

    return `You are an expert educational coach for the Post-School Success Platform (PSSP) at Nova Pioneer.

LEARNER ASSESSMENT DATA:
- Overall Readiness Score: ${overall_score}/100
- Readiness Level: ${readiness_level}
- Program: ${program || 'Not specified'}
- Goal: ${goal || 'Post-secondary success'}

CATEGORY SCORES:
- Academics: ${scores.academics}/100
- Career Skills: ${scores.career_skills}/100
- Life Skills: ${scores.life_skills}/100

ANALYSIS:
- Strengths: ${strengths.length > 0 ? strengths.join(', ') : 'None identified'}
- Growth Areas: ${growthAreas.length > 0 ? growthAreas.join(', ') : 'None identified'}

YOUR TASK:
Generate personalized, actionable recommendations to help this learner improve their readiness score. Focus on the growth areas while leveraging their strengths.

IMPORTANT INSTRUCTIONS:
1. Generate 2-3 recommendations maximum (prioritize growth areas)
2. Each recommendation must include:
   - category: "academics", "career_skills", "life_skills", or "general"
   - priority: "high", "medium", or "low"
   - recommendation: A clear, specific recommendation (1-2 sentences)
   - rationale: Why this matters based on their current scores
   - action_items: 3-5 specific, actionable steps with timeframes and benefits
   - resources: 2-4 relevant learning resources (courses, articles, workshops)
   - estimated_impact_time: How long until they see improvement

3. Make recommendations:
   - Specific to their program and goals
   - Realistic and achievable
   - Properly sequenced (high priority first)
   - Culturally relevant to African context
   - Aligned with Nova Pioneer values

4. For resources, include diverse types: courses, articles, videos, practice activities, mentorship opportunities

5. **CRITICAL - RESOURCE URLs**: 
   - ONLY include URLs that are real, active, and publicly accessible
   - Verify URL patterns are correct (e.g., Coursera courses use /learn/, edX uses /course/)
   - If you're not certain a URL exists, omit the "url" field entirely
   - It's better to provide NO URL than a broken URL
   - For platforms without specific URLs, provide the platform's homepage or search page
   - Test common platforms: Coursera, edX, Khan Academy, freeCodeCamp, YouTube, LinkedIn Learning

RESPONSE FORMAT (STRICT JSON):
Return ONLY a valid JSON array with no additional text, formatted exactly as shown:

[
  {
    "category": "career_skills",
    "priority": "high",
    "recommendation": "Develop project management and professional communication skills",
    "rationale": "Your career skills score of ${scores.career_skills} indicates significant room for growth in professional competencies essential for workplace success",
    "action_items": [
      {
        "action": "Complete an online Agile project management course",
        "timeframe": "2 weeks",
        "benefit": "Understanding Agile methodologies will improve your ability to manage team projects effectively"
      },
      {
        "action": "Lead a small group project in your current studies",
        "timeframe": "1 week",
        "benefit": "Hands-on leadership experience builds confidence and practical skills"
      },
      {
        "action": "Practice daily stand-up presentations with peers",
        "timeframe": "Daily for 2 weeks",
        "benefit": "Improves communication clarity and public speaking skills"
      }
    ],
    "resources": [
      {
        "title": "Agile Project Management Fundamentals",
        "type": "course",
        "url": "https://www.coursera.org/search?query=agile%20fundermentals",
        "duration": "3 hours",
        "description": "Learn the basics of Agile methodologies and Scrum framework"
      },
      {
        "title": "Effective Team Communication Guide",
        "type": "article",
        "url": "https://www.linkedin.com/learning/software-architecture-patterns-for-developers-25635719",
        "description": "Best practices for communicating in professional team environments"
      },
      {
        "title": "freeCodeCamp - Learn to Code",
        "type": "practice",
        "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures",
        "description": "Free coding tutorials and projects to build real-world skills"
      }
    ],
    "estimated_impact_time": "3-4 weeks"
  }
]

Generate the recommendations now as a JSON array:`;
  }

  /**
   * Build a simple prompt for testing
   */
  buildTestPrompt(): string {
    return `Respond with a simple JSON array containing one test recommendation:
[
  {
    "category": "general",
    "priority": "medium",
    "recommendation": "This is a test recommendation",
    "rationale": "Testing the AI integration",
    "action_items": [
      {
        "action": "Test action 1",
        "timeframe": "1 day",
        "benefit": "Verify the system works"
      }
    ],
    "resources": [
      {
        "title": "Test Resource",
        "type": "course",
        "description": "A test resource"
      }
    ],
    "estimated_impact_time": "1 week"
  }
]`;
  }
}
