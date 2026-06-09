import { z } from 'zod'
import { validateLayout } from './layout.schema'

export const CURRENT_VERSION = 1

export const projectMetadataSchema = z.object({
  tags: z.array(z.string()).default([]),
  description: z.string().default(''),
  lastOpenedAt: z.string().optional(),
}).default({})

export const projectSchema = z.object({
  version: z.number().default(CURRENT_VERSION),
  id: z.string().min(1),
  title: z.string().min(1).default('Untitled Project'),
  createdAt: z.string(),
  updatedAt: z.string(),
  layout: z.array(z.unknown()).default([]),
  metadata: projectMetadataSchema,
})

export function migrateProject(oldVersion, newVersion, project) {
  let migrated = { ...project }

  if (oldVersion < 1 && newVersion >= 1) {
    migrated.version = 1
    migrated.metadata = migrated.metadata || { tags: [], description: '' }
    migrated.layout = validateLayout(migrated.layout || [])
  }

  migrated.version = newVersion
  return migrated
}

export function repairProject(project) {
  const version = project.version ?? 0
  let repaired = migrateProject(version, CURRENT_VERSION, {
    id: project.id || crypto.randomUUID(),
    title: project.title || 'Untitled Project',
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
    layout: project.layout || [],
    metadata: project.metadata || { tags: [], description: '' },
    version,
  })

  repaired.layout = validateLayout(repaired.layout)
  const result = projectSchema.safeParse(repaired)
  return result.success ? result.data : null
}

export function validateProject(project) {
  const repaired = repairProject(project)
  return repaired ? { success: true, data: repaired } : { success: false, error: 'Invalid project' }
}
