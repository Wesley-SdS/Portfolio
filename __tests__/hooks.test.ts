import { renderHook } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { useExperience, useSkills } from '../src/hooks';

describe('useExperience', () => {
  it('should return experiences', () => {
    const { result } = renderHook(() => useExperience());
    
    expect(result.current.experiences).toBeDefined();
    expect(Array.isArray(result.current.experiences)).toBe(true);
    expect(result.current.experiences.length).toBeGreaterThan(0);
  });

  it('should return featured experiences', () => {
    const { result } = renderHook(() => useExperience());
    
    expect(result.current.featuredExperiences).toBeDefined();
    expect(Array.isArray(result.current.featuredExperiences)).toBe(true);
    expect(result.current.featuredExperiences.every(exp => exp.featured)).toBe(true);
  });

  it('should get experience by ID', () => {
    const { result } = renderHook(() => useExperience());
    
    const firstExperience = result.current.experiences[0];
    const experience = result.current.getExperienceById(firstExperience.id);
    expect(experience).toBeDefined();
    expect(experience?.id).toBe(firstExperience.id);
  });

  it('should return undefined for non-existent experience ID', () => {
    const { result } = renderHook(() => useExperience());
    
    const experience = result.current.getExperienceById('non-existent-id');
    expect(experience).toBeUndefined();
  });

  it('should get experiences by type', () => {
    const { result } = renderHook(() => useExperience());
    
    const fulltimeExperiences = result.current.getExperiencesByType('fulltime');
    expect(Array.isArray(fulltimeExperiences)).toBe(true);
  });
});

describe('useSkills', () => {
  it('should return skills data', () => {
    const { result } = renderHook(() => useSkills());
    
    expect(result.current.skills).toBeDefined();
    expect(typeof result.current.skills).toBe('object');
  });

  it('should have frontend skills', () => {
    const { result } = renderHook(() => useSkills());
    
    expect(result.current.skills.frontend).toBeDefined();
    expect(Array.isArray(result.current.skills.frontend)).toBe(true);
  });

  it('should have backend skills', () => {
    const { result } = renderHook(() => useSkills());
    
    expect(result.current.skills.backend).toBeDefined();
    expect(Array.isArray(result.current.skills.backend)).toBe(true);
  });

  it('should get skills by category', () => {
    const { result } = renderHook(() => useSkills());
    
    const frontendSkills = result.current.getSkillsByCategory('frontend');
    expect(Array.isArray(frontendSkills)).toBe(true);
    expect(frontendSkills.every(skill => skill.category === 'frontend')).toBe(true);
  });

  it('should get skills by level', () => {
    const { result } = renderHook(() => useSkills());
    
    const expertSkills = result.current.getSkillsByLevel('expert');
    expect(Array.isArray(expertSkills)).toBe(true);
    expect(expertSkills.every(skill => skill.level === 'expert')).toBe(true);
  });

  it('should get expert skills', () => {
    const { result } = renderHook(() => useSkills());
    
    const expertSkills = result.current.expertSkills;
    expect(Array.isArray(expertSkills)).toBe(true);
    expect(expertSkills.every(skill => skill.level === 'expert')).toBe(true);
  });
});