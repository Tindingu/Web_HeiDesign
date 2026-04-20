import { NextRequest, NextResponse } from "next/server";
import {
  readProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/project-storage";
import type { Project } from "@/lib/strapi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      const project = await getProjectById(parseInt(id));
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(project);
    }

    const projects = await readProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<
      Project,
      "id" | "createdAt" | "updatedAt"
    >;

    const project = await createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    console.error("POST /api/projects error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const project = await updateProject(parseInt(id), body);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update project";
    console.error("PUT /api/projects error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );
    }

    const success = await deleteProject(parseInt(id));

    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    console.error("DELETE /api/projects error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
