import type { Project } from "@/lib/strapi";
import fs from "fs/promises";
import path from "path";

const projectsFile = path.join(process.cwd(), "data", "projects.json");

async function ensureDataDir() {
  const dir = path.dirname(projectsFile);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

export async function readProjects(): Promise<Project[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(projectsFile, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), "utf-8");
}

export async function getProjectById(id: number): Promise<Project | null> {
  const projects = await readProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await readProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
  const projects = await readProjects();
  const newProject: Project = {
    ...project,
    id: Math.max(0, ...projects.map((p) => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  await writeProjects(projects);
  return newProject;
}

export async function updateProject(
  id: number,
  updates: Partial<Project>,
): Promise<Project | null> {
  const projects = await readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    id: projects[index].id, // Prevent ID changes
    updatedAt: new Date().toISOString(),
  };
  await writeProjects(projects);
  return projects[index];
}

export async function deleteProject(id: number): Promise<boolean> {
  const projects = await readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;

  await writeProjects(filtered);
  return true;
}
