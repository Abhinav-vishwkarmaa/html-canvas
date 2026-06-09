import { repairProject, CURRENT_VERSION } from '../schemas/project.schema'

export { CURRENT_VERSION, migrateProject } from '../schemas/project.schema'

export function migrateProjects(projects) {
  if (!Array.isArray(projects)) return []
  return projects.map(repairProject).filter(Boolean)
}
