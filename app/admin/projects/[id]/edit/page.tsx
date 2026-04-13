import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/project-storage";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(parseInt(params.id));

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} />;
}
