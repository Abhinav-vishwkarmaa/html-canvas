import { memo, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, LayoutTemplate, Sparkles } from 'lucide-react'
import useStore from '../store/useStore'
import ThemeToggle from '../components/common/ThemeToggle'
import ProjectCard from '../components/dashboard/ProjectCard'
import CreateProjectModal from '../components/dashboard/CreateProjectModal'
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal'
import UsageSummary from '../components/dashboard/UsageSummary'

function DashboardPage() {
  const navigate = useNavigate()
  const projects = useStore((s) => s.projects)
  const deleteProject = useStore((s) => s.deleteProject)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return projects
    const q = search.toLowerCase()
    return projects.filter((p) => p.title.toLowerCase().includes(q))
  }, [projects, search])

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteProject(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            TemplateCraft
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Explore Templates
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">Visual Website Builder</span>
          </div>
          <h2 className="text-4xl font-bold font-display mb-4">Build Beautiful Websites Visually</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Drag, drop, and customize — no code required. Create stunning pages in minutes with TemplateCraft.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold font-display">Your Projects</h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-16 text-center">
            <LayoutTemplate className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h4 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              {search ? 'No projects found' : 'No projects yet'}
            </h4>
            <p className="text-sm text-slate-500 mb-6">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <UsageSummary />
        </div>
      </main>

      <CreateProjectModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        projectTitle={deleteTarget?.title}
      />
    </div>
  )
}

export default memo(DashboardPage)
