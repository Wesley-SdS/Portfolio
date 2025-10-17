import { useMemo } from 'react';
import { experienceData, skillsData } from '../constants';
import { Experience, Skill } from '../types';

export const useExperience = () => {
  const experiences = useMemo(() => experienceData, []);

  const featuredExperiences = useMemo(
    () => experiences.filter(exp => exp.featured),
    [experiences]
  );

  const getExperienceById = useMemo(
    () => (id: string): Experience | undefined =>
      experiences.find(exp => exp.id === id),
    [experiences]
  );

  const getExperiencesByType = useMemo(
    () => (type: Experience['type']): Experience[] =>
      experiences.filter(exp => exp.type === type),
    [experiences]
  );

  return {
    experiences,
    featuredExperiences,
    getExperienceById,
    getExperiencesByType
  };
};

export const useSkills = () => {
  const skills = useMemo(() => skillsData, []);

  const getAllSkills = useMemo(
    () => Object.values(skills).flat(),
    [skills]
  );

  const getSkillsByCategory = useMemo(
    () => (category: Skill['category']): Skill[] =>
      skills[category] || [],
    [skills]
  );

  const getSkillsByLevel = useMemo(
    () => (level: Skill['level']): Skill[] =>
      getAllSkills.filter(skill => skill.level === level),
    [getAllSkills]
  );

  const expertSkills = useMemo(
    () => getAllSkills.filter(skill => skill.level === 'expert'),
    [getAllSkills]
  );

  return {
    skills,
    getAllSkills,
    getSkillsByCategory,
    getSkillsByLevel,
    expertSkills
  };
};