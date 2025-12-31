// app/deploy/page.tsx  (or pages/deploy.tsx if using pages router)

export default function Deploy() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <a
        href="https://vercel.com/new/clone?repository-url=https://github.com/next-builder-bd/user-site-1"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 22px",
          borderRadius: "10px",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        Deploy with Vercel
      </a>
    </div>
  );
}
