import styles from './PageWrapper.module.css'

interface PageWrapperProps {
  children: React.ReactNode
  layout?: 'narrow' | 'wide' | 'fluid'
  title?: string
  actions?: React.ReactNode
}

export function PageWrapper({ 
  children, 
  layout = 'wide',
  title,
  actions
}: PageWrapperProps) {
  return (
    <div className={styles.page}>
      {(title || actions) && (
        <div className={styles.pageHeader}>
          {title && <h1 className={styles.pageTitle}>{title}</h1>}
          {actions && <div className={styles.pageActions}>{actions}</div>}
        </div>
      )}
      <div className={`${styles.pageContent} ${styles[`layout-${layout}`]}`}>
        {children}
      </div>
    </div>
  )
}
