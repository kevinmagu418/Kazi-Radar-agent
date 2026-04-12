import axios from "axios";
import pino from "pino";

const logger = pino({ level: "info" });

export const worldbankFetcher = async (query: string, metadata: any) => {
  try {
    // World Bank Projects API
    const url = `https://search.worldbank.org/api/v2/projects?format=json&qterm=${encodeURIComponent(query)}&rows=5`;
    const response = await axios.get(url);

    const projects = response.data.projects;
    if (!projects) return [];

    return Object.values(projects).map((project: any) => ({
      title: project.project_name,
      url: `https://projects.worldbank.org/en/projects-operations/project-detail/${project.id}`,
      content: `${project.project_name}. Status: ${project.status}. Region: ${project.regionname}. ${project.project_abstract?.cdata || ""}`,
      proofLinks: [`https://projects.worldbank.org/en/projects-operations/project-detail/${project.id}`],
      provider: "worldbank",
    }));
  } catch (error) {
    logger.error(` World Bank API Error: ${error}`);
    return [];
  }
};
