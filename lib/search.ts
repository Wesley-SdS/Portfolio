import { Project } from '@/src/types/project';
import { projectsData } from '@/src/constants/modernProjects';

export interface SearchResult {
  type: 'project' | 'skill' | 'experience';
  id: string;
  title: string;
  description: string;
  url: string;
  relevance: number;
}

export function searchProjects(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  projectsData.forEach((project) => {
    let relevance = 0;

    // Title match (highest relevance)
    if (project.title.toLowerCase().includes(lowerQuery)) {
      relevance += 10;
    }

    // Description match
    if (project.description.toLowerCase().includes(lowerQuery)) {
      relevance += 5;
    }

    // Technology match
    project.technologies.forEach((tech) => {
      if (tech.toLowerCase().includes(lowerQuery)) {
        relevance += 3;
      }
    });

    // Category match
    if (project.category.toLowerCase().includes(lowerQuery)) {
      relevance += 2;
    }

    if (relevance > 0) {
      results.push({
        type: 'project',
        id: project.id,
        title: project.title,
        description: project.description,
        url: `/#projects`,
        relevance,
      });
    }
  });

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
}

export function searchAll(query: string): SearchResult[] {
  const projectResults = searchProjects(query);
  // TODO: Add skills and experience search when data is available
  return projectResults;
}



