import { useMemo } from 'react';
import { projectsData } from '../constants';
import { Project, ProjectFilter } from '../types';

export const useProjects = () => {
  const projects = useMemo(() => projectsData, []);

  const featuredProjects = useMemo(
    () => projects.filter(project => project.featured),
    [projects]
  );

  const getProjectById = useMemo(
    () => (id: string): Project | undefined =>
      projects.find(project => project.id === id),
    [projects]
  );

  const getProjectsByCategory = useMemo(
    () => (category: Project['category']): Project[] =>
      projects.filter(project => project.category === category),
    [projects]
  );

  const getProjectsByStatus = useMemo(
    () => (status: Project['status']): Project[] =>
      projects.filter(project => project.status === status),
    [projects]
  );

  const filterProjects = useMemo(
    () => (filter: ProjectFilter): Project[] => {
      return projects.filter(project => {
        if (filter.category && project.category !== filter.category) return false;
        if (filter.status && project.status !== filter.status) return false;
        if (filter.featured !== undefined && project.featured !== filter.featured) return false;
        if (filter.technology && !project.technologies.includes(filter.technology)) return false;
        return true;
      });
    },
    [projects]
  );

  const getUniqueCategories = useMemo(
    () => Array.from(new Set(projects.map(project => project.category))),
    [projects]
  );

  const getUniqueTechnologies = useMemo(
    () => Array.from(new Set(projects.flatMap(project => project.technologies))),
    [projects]
  );

  return {
    projects,
    featuredProjects,
    getProjectById,
    getProjectsByCategory,
    getProjectsByStatus,
    filterProjects,
    getUniqueCategories,
    getUniqueTechnologies
  };
};