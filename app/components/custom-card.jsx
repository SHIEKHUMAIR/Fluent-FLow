export function Card({ children, className = "", style = {}, ...props }) {
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    ...style,
  }

  return (
    <div className={className} style={cardStyle} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", style = {}, ...props }) {
  const headerStyle = {
    padding: "24px 24px 16px 24px",
    borderBottom: "1px solid #f3f4f6",
    ...style,
  }

  return (
    <div style={headerStyle} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", style = {}, ...props }) {
  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0",
    ...style,
  }

  return (
    <h3 style={titleStyle} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = "", style = {}, ...props }) {
  const contentStyle = {
    padding: "16px 24px 24px 24px",
    ...style,
  }

  return (
    <div style={contentStyle} {...props}>
      {children}
    </div>
  )
}
