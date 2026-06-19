// AI Volunteer Recommendation Engine (keyword matching)
const roleKeywords = {
  'Frontend Volunteer': ['html', 'css', 'javascript', 'angular', 'react', 'vue', 'bootstrap', 'sass', 'tailwind', 'ui', 'ux', 'figma', 'frontend', 'web design'],
  'Backend Volunteer': ['node', 'nodejs', 'express', 'python', 'django', 'java', 'spring', 'php', 'laravel', 'api', 'rest', 'graphql', 'backend', 'server'],
  'Full Stack Volunteer': ['fullstack', 'full stack', 'mern', 'mean', 'angular', 'react', 'node', 'mongodb', 'mysql', 'postgresql', 'firebase', 'full-stack'],
  'AI Volunteer': ['machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'data science', 'scikit'],
  'Data Analytics Volunteer': ['data analytics', 'data analysis', 'sql', 'excel', 'tableau', 'power bi', 'pandas', 'numpy', 'statistics', 'visualization', 'dashboard', 'reporting'],
  'Mobile Development Volunteer': ['android', 'ios', 'flutter', 'react native', 'kotlin', 'swift', 'mobile', 'app development'],
  'DevOps Volunteer': ['devops', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'linux', 'cloud', 'infrastructure'],
  'Community Outreach Volunteer': ['community', 'social work', 'outreach', 'ngo', 'volunteer management', 'communication', 'event planning', 'coordination']
};

const getRecommendation = (skills) => {
  if (!skills || skills.length === 0) {
    return { role: 'Community Outreach Volunteer', confidence: 0, matches: [] };
  }

  const normalizedSkills = skills.map(s => s.toLowerCase().trim());
  const scores = {};

  Object.entries(roleKeywords).forEach(([role, keywords]) => {
    scores[role] = 0;
    const matchedKeywords = [];
    keywords.forEach(keyword => {
      const matched = normalizedSkills.some(skill =>
        skill.includes(keyword) || keyword.includes(skill)
      );
      if (matched) {
        scores[role]++;
        matchedKeywords.push(keyword);
      }
    });
    scores[role] = { count: scores[role], keywords: matchedKeywords };
  });

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1].count - a[1].count)
    .filter(([_, v]) => v.count > 0);

  if (sorted.length === 0) {
    return {
      role: 'Community Outreach Volunteer',
      confidence: 0,
      matches: [],
      allRoles: Object.keys(roleKeywords)
    };
  }

  const top = sorted[0];
  const maxPossible = roleKeywords[top[0]].length;
  const confidence = Math.round((top[1].count / maxPossible) * 100);

  return {
    role: top[0],
    confidence: Math.min(confidence, 95),
    matches: top[1].keywords,
    alternatives: sorted.slice(1, 3).map(([role]) => role),
    allRoles: Object.keys(roleKeywords)
  };
};

module.exports = { getRecommendation };
