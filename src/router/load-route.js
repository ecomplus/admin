import newPageHTML from '@/views/new.html'

const fixHtmlImport = importPromise => importPromise
  .then(exp => ({ html: exp.default }))

export default path => {
  switch (path) {
    case 'new':
      return Promise.resolve({ html: newPageHTML })
    case 'home':
      return import('./routes/home')
    case 'resources':
      return import('./routes/resources')
    case 'apps':
      return import('./routes/apps')
    case 'invoices':
      return import('./routes/invoices')
    case 'settings':
      return import('./routes/settings')
    case 'tag':
      return import('./routes/tag')
    case 'tagstandard':
      return import('./routes/tagstandard')
    case '500':
      return fixHtmlImport(import('@/views/500.html'))
    default:
      return fixHtmlImport(import('@/views/404.html'))
  }
}
